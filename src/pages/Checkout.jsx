import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { showToast } from "../utils/toast"
import "./Checkout.css"

/* ── Luhn algoritması ── */
function luhnCheck(num) {
    const digits = num.replace(/\D/g, "")
    if (digits.length !== 16) return false
    let sum = 0
    let shouldDouble = false
    for (let i = digits.length - 1; i >= 0; i--) {
        let d = parseInt(digits[i])
        if (shouldDouble) {
            d *= 2
            if (d > 9) d -= 9
        }
        sum += d
        shouldDouble = !shouldDouble
    }
    return sum % 10 === 0
}

/* ── son kullanma tarihi kontrolü ── */
function validateExpiry(value) {
    if (!/^\d{2}\/\d{2}$/.test(value)) return "Son kullanma tarihi MM/YY formatında olmalı"
    const [mm, yy] = value.split("/").map(Number)
    if (mm < 1 || mm > 12) return "Ay geçersiz (01-12)"
    const now = new Date()
    const expDate = new Date(2000 + yy, mm)   /* ayın sonu */
    if (expDate <= now) return "Kartın son kullanma tarihi geçmiş"
    return null
}

/* ── tam kart validasyonu ── */
function validateCard(number, expiry, cvv, name) {
    if (!name.trim()) return "Kart üzerindeki isim gerekli"
    if (!luhnCheck(number)) return "Geçersiz kart numarası"
    const expiryErr = validateExpiry(expiry)
    if (expiryErr) return expiryErr
    if (cvv.length !== 3) return "CVV 3 haneli olmalı"
    return null
}

function Checkout({ cart }) {

    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")

    const [cardName, setCardName] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [cardDate, setCardDate] = useState("")
    const [cardCvv, setCardCvv] = useState("")

    /* validation errors inline */
    const [cardErrors, setCardErrors] = useState({})

    const [savedCards, setSavedCards] = useState([])
    const [selectedCard, setSelectedCard] = useState(null)
    const [paymentType, setPaymentType] = useState("saved")
    const [successAnim, setSuccessAnim] = useState(false)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

    /* ── format helpers ── */
    const fmtCardNumber = (v) =>
        v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()

    const fmtExpiry = (v) => {
        const c = v.replace(/\D/g, "").slice(0, 4)
        return c.length >= 3 ? c.slice(0, 2) + "/" + c.slice(2) : c
    }

    /* ── load user + cards ── */
    useEffect(() => {
        const init = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data.user)
            if (data.user) {
                /* profil bilgilerini otomatik doldur */
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", data.user.id)
                    .single()
                if (profile) {
                    setName(profile.full_name || "")
                    setAddress(profile.address || "")
                }
                setEmail(data.user.email || "")

                const { data: cardsData } = await supabase
                    .from("cards")
                    .select("*")
                    .eq("user_id", data.user.id)
                setSavedCards(cardsData || [])
                if (cardsData?.length > 0) {
                    setSelectedCard(cardsData[0])
                } else {
                    /* kayıtlı kart yoksa direkt yeni karta geç */
                    setPaymentType("new")
                }
            }
        }
        init()
    }, [])

    /* ── inline kart hata temizle ── */
    const clearCardError = (field) =>
        setCardErrors(prev => { const e = { ...prev }; delete e[field]; return e })

    /* ── sipariş oluştur ── */
    const createOrder = async () => {
        if (cart.length === 0) return showToast("Sepet boş", "warning")
        if (!name || !email || !address) return showToast("Teslimat bilgilerini eksiksiz doldur", "warning")

        if (paymentType === "saved") {
            if (!selectedCard) return showToast("Lütfen bir kart seç", "error")
        } else {
            const err = validateCard(cardNumber, cardDate, cardCvv, cardName)
            if (err) {
                showToast(err, "error")
                /* inline hata göster */
                if (err.includes("kart numarası")) setCardErrors(p => ({ ...p, number: err }))
                if (err.includes("kullanma")) setCardErrors(p => ({ ...p, expiry: err }))
                if (err.includes("CVV")) setCardErrors(p => ({ ...p, cvv: err }))
                if (err.includes("isim")) setCardErrors(p => ({ ...p, name: err }))
                return
            }
        }

        setLoading(true)
        const { error } = await supabase
            .from("orders")
            .insert([{
                user_email: user?.email || email,
                products: cart,
                total_price: total,
                address,
                status: "pending",
            }])
        setLoading(false)

        if (error) {
            showToast("Sipariş oluşturulamadı: " + error.message, "error")
        } else {
            setSuccessAnim(true)
            showToast("Siparişin oluşturuldu! 🎉", "success")
            setTimeout(() => navigate("/orders"), 2200)
        }
    }

    return (
        <div className="checkoutPage">
            <h1 className="checkoutTitle">Sipariş & Ödeme</h1>

            <div className="checkoutContainer">

                {/* ── SOL ── */}
                <div className="checkoutLeft">

                    {/* teslimat */}
                    <div className="checkoutBox">
                        <h3>📍 Teslimat Bilgileri</h3>
                        <div className="checkoutField">
                            <label>Ad Soyad</label>
                            <input placeholder="Ad Soyad" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="checkoutField">
                            <label>E-posta</label>
                            <input type="email" placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="checkoutField">
                            <label>Teslimat Adresi</label>
                            <textarea placeholder="Adresinizi girin" value={address} onChange={e => setAddress(e.target.value)} />
                        </div>
                    </div>

                    {/* ödeme yöntemi */}
                    <div className="checkoutBox">
                        <h3>💳 Ödeme Yöntemi</h3>
                        <div className="paymentSwitch">
                            <label className={paymentType === "saved" ? "active" : ""}>
                                <input type="radio" checked={paymentType === "saved"} onChange={() => setPaymentType("saved")} />
                                <span>Kayıtlı Kart</span>
                            </label>
                            <label className={paymentType === "new" ? "active" : ""}>
                                <input type="radio" checked={paymentType === "new"} onChange={() => setPaymentType("new")} />
                                <span>Yeni Kart</span>
                            </label>
                        </div>
                    </div>

                    {/* kayıtlı kartlar */}
                    {paymentType === "saved" && (
                        <div className="checkoutBox">
                            <h3>Kart Seç</h3>
                            {savedCards.length === 0 ? (
                                <p className="noCardText">
                                    Kayıtlı kartın yok.{" "}
                                    <button className="switchToNewBtn" onClick={() => setPaymentType("new")}>
                                        Yeni kart ekle →
                                    </button>
                                </p>
                            ) : (
                                savedCards.map(card => (
                                    <div
                                        key={card.id}
                                        className={`savedCard${selectedCard?.id === card.id ? " active" : ""}`}
                                        onClick={() => setSelectedCard(card)}
                                    >
                                        <input type="radio" checked={selectedCard?.id === card.id} readOnly />
                                        <div className="cardInfo">
                                            <p>**** **** **** {card.last4}</p>
                                            <span>{card.expiry} · {card.name}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* yeni kart */}
                    {paymentType === "new" && (
                        <div className="checkoutBox">
                            <h3>💳 Kart Bilgileri</h3>

                            <div className="checkoutField">
                                <label>Kart Üzerindeki İsim</label>
                                <input
                                    placeholder="Ad Soyad"
                                    value={cardName}
                                    className={cardErrors.name ? "inputErr" : ""}
                                    onChange={e => { setCardName(e.target.value); clearCardError("name") }}
                                />
                                {cardErrors.name && <span className="fieldErr">{cardErrors.name}</span>}
                            </div>

                            <div className="checkoutField">
                                <label>Kart Numarası</label>
                                <input
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    value={cardNumber}
                                    className={cardErrors.number ? "inputErr" : ""}
                                    onChange={e => { setCardNumber(fmtCardNumber(e.target.value)); clearCardError("number") }}
                                />
                                {cardErrors.number && <span className="fieldErr">{cardErrors.number}</span>}
                            </div>

                            <div className="cardRow">
                                <div className="checkoutField">
                                    <label>Son Kullanma</label>
                                    <input
                                        placeholder="MM/YY"
                                        value={cardDate}
                                        className={cardErrors.expiry ? "inputErr" : ""}
                                        onChange={e => { setCardDate(fmtExpiry(e.target.value)); clearCardError("expiry") }}
                                    />
                                    {cardErrors.expiry && <span className="fieldErr">{cardErrors.expiry}</span>}
                                </div>
                                <div className="checkoutField">
                                    <label>CVV</label>
                                    <input
                                        placeholder="•••"
                                        type="password"
                                        maxLength={3}
                                        value={cardCvv}
                                        className={cardErrors.cvv ? "inputErr" : ""}
                                        onChange={e => { setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3)); clearCardError("cvv") }}
                                    />
                                    {cardErrors.cvv && <span className="fieldErr">{cardErrors.cvv}</span>}
                                </div>
                            </div>

                            <p className="secureText">🔒 256-bit SSL şifrelemeli güvenli ödeme</p>
                        </div>
                    )}
                </div>

                {/* ── SAĞ — ÖZET ── */}
                <div className="orderSummary">
                    <h3>Sipariş Özeti</h3>

                    <div className="orderItems">
                        {cart.map(item => (
                            <div className="orderItem" key={item.id}>
                                <img src={item.image} alt={item.name} />
                                <div>
                                    <p>{item.name}</p>
                                    <span>{item.price.toLocaleString("tr-TR")} TL × {item.qty}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="orderTotalRow">
                        <span>Ara Toplam</span>
                        <span>{total.toLocaleString("tr-TR")} TL</span>
                    </div>
                    <div className="orderTotalRow">
                        <span>Kargo</span>
                        <span className="freeShip">Ücretsiz</span>
                    </div>
                    <div className="orderTotalRow orderGrandTotal">
                        <span>Toplam</span>
                        <strong>{total.toLocaleString("tr-TR")} TL</strong>
                    </div>

                    <button
                        className="checkoutSubmitBtn"
                        onClick={createOrder}
                        disabled={loading}
                    >
                        {loading ? (
                            <><span className="btnSpinner" /> İşleniyor…</>
                        ) : "Siparişi Tamamla"}
                    </button>
                </div>
            </div>

            {/* başarı animasyonu */}
            {successAnim && (
                <div className="paymentSuccess">
                    <div className="successCheck">✔</div>
                    <h2>Sipariş Oluşturuldu!</h2>
                    <p>Siparişlerim sayfasına yönlendiriliyorsunuz…</p>
                </div>
            )}
        </div>
    )
}

export default Checkout