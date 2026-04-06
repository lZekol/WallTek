import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { showToast } from "../utils/toast"
import "./Checkout.css"

/* ── Luhn algoritması ── */
function luhnCheck(num) {
    const digits = num.replace(/\D/g, "")
    if (digits.length !== 16) return false
    let sum = 0, shouldDouble = false
    for (let i = digits.length - 1; i >= 0; i--) {
        let d = parseInt(digits[i])
        if (shouldDouble) { d *= 2; if (d > 9) d -= 9 }
        sum += d; shouldDouble = !shouldDouble
    }
    return sum % 10 === 0
}

function validateExpiry(mm, yy) {
    const m = parseInt(mm), y = parseInt(yy)
    if (m < 1 || m > 12) return "Ay geçersiz (01-12)"
    const expDate = new Date(2000 + y, m)
    if (expDate <= new Date()) return "Kartın son kullanma tarihi geçmiş"
    return null
}

/* İyzico hata kodlarını Türkçeye çevir */
function translateIyzicoError(code, msg) {
    const map = {
        "10051": "Kart limiti yetersiz",
        "10005": "İşlem onaylanmadı",
        "10012": "Geçersiz işlem",
        "10041": "Kayıp kart",
        "10043": "Çalıntı kart",
        "10054": "Vadesi geçmiş kart",
        "10057": "Kart sahibi bu işlemi yapamaz",
        "10058": "Bu terminal bu işlemi yapamaz",
        "10034": "Sahte işlem şüphesi",
        "10093": "Kartınız e-ticaret işlemlerine kapalı",
        "10201": "Kart, bankası tarafından engellendi",
        "10204": "Ödeme yapılamıyor",
    }
    return map[code] || msg || "Ödeme başarısız. Kart bilgilerini kontrol edin."
}

function Checkout({ cart }) {
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [cardName, setCardName] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [cardMonth, setCardMonth] = useState("")
    const [cardYear, setCardYear] = useState("")
    const [cardCvv, setCardCvv] = useState("")
    const [cardErrors, setCardErrors] = useState({})
    const [savedCards, setSavedCards] = useState([])
    const [selectedCard, setSelectedCard] = useState(null)
    const [paymentType, setPaymentType] = useState("saved")
    const [successAnim, setSuccessAnim] = useState(false)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

    const fmtCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim()
    const fmtMonth = (v) => v.replace(/\D/g, "").slice(0, 2)
    const fmtYear = (v) => v.replace(/\D/g, "").slice(0, 2)

    useEffect(() => {
        const init = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data.user)
            if (data.user) {
                const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()
                if (profile) { setName(profile.full_name || ""); setAddress(profile.address || "") }
                setEmail(data.user.email || "")
                const { data: cards } = await supabase.from("cards").select("*").eq("user_id", data.user.id)
                setSavedCards(cards || [])
                if (cards?.length > 0) setSelectedCard(cards[0])
                else setPaymentType("new")
            }
        }
        init()
    }, [])

    const clearCardError = (f) => setCardErrors(p => { const e = { ...p }; delete e[f]; return e })

    /* ── Ödeme ── */
    const createOrder = async () => {
        if (cart.length === 0) return showToast("Sepet boş", "warning")
        if (!name || !email || !address) return showToast("Teslimat bilgilerini doldur", "warning")

        let finalCardName, finalCardNumber, finalMonth, finalYear, finalCvv

        if (paymentType === "saved") {
            if (!selectedCard) return showToast("Kart seçmelisin", "error")
            /* kayıtlı kartlar için CVV tekrar istenir (PCI gereği tam numara saklanmaz) */
            if (!cardCvv || cardCvv.length !== 3) {
                setCardErrors({ cvv: "Kayıtlı kart için CVV girin" })
                return showToast("Kayıtlı kart için CVV girin", "error")
            }
            /* Demo: kayıtlı kart için tam numarayı DB'de tutmuyoruz, gerçekte tokenization gerekir */
            showToast("Kayıtlı kart ödemesi için bankadan token entegrasyonu gerekir. Şimdilik yeni kart kullanın.", "info")
            return
        }

        /* yeni kart validasyonu */
        const errs = {}
        if (!cardName.trim()) errs.name = "Kart sahibi adı gerekli"
        if (!luhnCheck(cardNumber)) errs.number = "Geçersiz kart numarası"
        const expErr = validateExpiry(cardMonth, cardYear)
        if (expErr) errs.expiry = expErr
        if (!cardMonth || cardMonth.length !== 2) errs.expiry = "Ay 2 haneli olmalı (örn: 07)"
        if (!cardYear || cardYear.length !== 2) errs.expiry = (errs.expiry || "") + " — Yıl 2 haneli olmalı (örn: 26)"
        if (cardCvv.length !== 3) errs.cvv = "CVV 3 haneli olmalı"

        if (Object.keys(errs).length) {
            setCardErrors(errs)
            showToast(Object.values(errs)[0], "error")
            return
        }

        finalCardName = cardName
        finalCardNumber = cardNumber
        finalMonth = cardMonth
        finalYear = cardYear
        finalCvv = cardCvv

        setLoading(true)

        try {
            const { data: { session } } = await supabase.auth.getSession()

            const res = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({
                        cart,
                        address,
                        cardHolderName: finalCardName,
                        cardNumber: finalCardNumber,
                        expireMonth: finalMonth,
                        expireYear: finalYear,
                        cvc: finalCvv,
                        userEmail: user?.email || email,
                        userId: user?.id || "guest",
                    }),
                }
            )

            const result = await res.json()

            if (result.success) {
                setSuccessAnim(true)
                showToast("Ödeme başarılı! 🎉", "success")
                setTimeout(() => navigate("/orders"), 2200)
            } else {
                const msg = translateIyzicoError(result.errorCode, result.errorMessage)
                showToast(msg, "error")
                /* kart numarası hatasıysa ilgili alanı kırmızı yap */
                if (result.errorCode === "10051" || result.errorCode === "10005") {
                    setCardErrors({ general: msg })
                }
            }
        } catch (err) {
            showToast("Bağlantı hatası: " + err.message, "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="checkoutPage">
            <h1 className="checkoutTitle">Sipariş & Ödeme</h1>

            <div className="checkoutContainer">
                <div className="checkoutLeft">

                    {/* teslimat */}
                    <div className="checkoutBox">
                        <h3>📍 Teslimat Bilgileri</h3>
                        <div className="checkoutField"><label>Ad Soyad</label>
                            <input placeholder="Ad Soyad" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="checkoutField"><label>E-posta</label>
                            <input type="email" placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="checkoutField"><label>Teslimat Adresi</label>
                            <textarea placeholder="Adresinizi girin" value={address} onChange={e => setAddress(e.target.value)} />
                        </div>
                    </div>

                    {/* ödeme switch */}
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

                    {/* kayıtlı kart */}
                    {paymentType === "saved" && (
                        <div className="checkoutBox">
                            <h3>Kart Seç</h3>
                            {savedCards.length === 0 ? (
                                <p className="noCardText">Kayıtlı kartın yok.{" "}
                                    <button className="switchToNewBtn" onClick={() => setPaymentType("new")}>Yeni kart ekle →</button>
                                </p>
                            ) : (
                                <>
                                    {savedCards.map(card => (
                                        <div key={card.id}
                                            className={`savedCard${selectedCard?.id === card.id ? " active" : ""}`}
                                            onClick={() => setSelectedCard(card)}
                                        >
                                            <input type="radio" checked={selectedCard?.id === card.id} readOnly />
                                            <div className="cardInfo">
                                                <p>**** **** **** {card.last4}</p>
                                                <span>{card.expiry} · {card.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="checkoutField" style={{ marginTop: 8 }}>
                                        <label>CVV (güvenlik kodu)</label>
                                        <input placeholder="•••" type="password" maxLength={3}
                                            value={cardCvv} className={cardErrors.cvv ? "inputErr" : ""}
                                            onChange={e => { setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3)); clearCardError("cvv") }}
                                            style={{ maxWidth: 100 }} />
                                        {cardErrors.cvv && <span className="fieldErr">{cardErrors.cvv}</span>}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* yeni kart */}
                    {paymentType === "new" && (
                        <div className="checkoutBox">
                            <h3>💳 Kart Bilgileri</h3>

                            {cardErrors.general && (
                                <div style={{ background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.3)", color: "#ff8080", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
                                    {cardErrors.general}
                                </div>
                            )}

                            <div className="checkoutField">
                                <label>Kart Üzerindeki İsim</label>
                                <input placeholder="AD SOYAD" value={cardName} className={cardErrors.name ? "inputErr" : ""}
                                    onChange={e => { setCardName(e.target.value.toUpperCase()); clearCardError("name") }} />
                                {cardErrors.name && <span className="fieldErr">{cardErrors.name}</span>}
                            </div>

                            <div className="checkoutField">
                                <label>Kart Numarası</label>
                                <input placeholder="XXXX XXXX XXXX XXXX" value={cardNumber} className={cardErrors.number ? "inputErr" : ""}
                                    onChange={e => { setCardNumber(fmtCard(e.target.value)); clearCardError("number") }} />
                                {cardErrors.number && <span className="fieldErr">{cardErrors.number}</span>}
                            </div>

                            <div className="cardRow">
                                <div className="checkoutField">
                                    <label>Ay / Yıl</label>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        <input placeholder="MM" maxLength={2} value={cardMonth} className={cardErrors.expiry ? "inputErr" : ""}
                                            onChange={e => { setCardMonth(fmtMonth(e.target.value)); clearCardError("expiry") }}
                                            style={{ width: 64 }} />
                                        <span style={{ color: "rgba(255,255,255,0.4)", alignSelf: "center" }}>/</span>
                                        <input placeholder="YY" maxLength={2} value={cardYear} className={cardErrors.expiry ? "inputErr" : ""}
                                            onChange={e => { setCardYear(fmtYear(e.target.value)); clearCardError("expiry") }}
                                            style={{ width: 64 }} />
                                    </div>
                                    {cardErrors.expiry && <span className="fieldErr">{cardErrors.expiry}</span>}
                                </div>
                                <div className="checkoutField">
                                    <label>CVV</label>
                                    <input placeholder="•••" type="password" maxLength={3} value={cardCvv} className={cardErrors.cvv ? "inputErr" : ""}
                                        onChange={e => { setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3)); clearCardError("cvv") }} />
                                    {cardErrors.cvv && <span className="fieldErr">{cardErrors.cvv}</span>}
                                </div>
                            </div>

                            <p className="secureText">🔒 256-bit SSL · İyzico güvenli ödeme altyapısı</p>
                        </div>
                    )}
                </div>

                {/* özet */}
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
                    <div className="orderTotalRow"><span>Ara Toplam</span><span>{total.toLocaleString("tr-TR")} TL</span></div>
                    <div className="orderTotalRow"><span>Kargo</span><span className="freeShip">Ücretsiz</span></div>
                    <div className="orderTotalRow orderGrandTotal">
                        <span>Toplam</span>
                        <strong>{total.toLocaleString("tr-TR")} TL</strong>
                    </div>
                    <button className="checkoutSubmitBtn" onClick={createOrder} disabled={loading}>
                        {loading ? <><span className="btnSpinner" /> İşleniyor…</> : "Siparişi Tamamla"}
                    </button>
                </div>
            </div>

            {successAnim && (
                <div className="paymentSuccess">
                    <div className="successCheck">✔</div>
                    <h2>Ödeme Başarılı!</h2>
                    <p>Siparişlerim sayfasına yönlendiriliyorsunuz…</p>
                </div>
            )}
        </div>
    )
}

export default Checkout