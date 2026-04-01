import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { showToast } from "../utils/toast"
import "./Checkout.css"

function Checkout({ cart }) {

    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")

    const [cardName, setCardName] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [cardDate, setCardDate] = useState("")
    const [cardCvv, setCardCvv] = useState("")

    const [savedCards, setSavedCards] = useState([])
    const [selectedCard, setSelectedCard] = useState(null)

    const [paymentType, setPaymentType] = useState("saved")

    const [successAnim, setSuccessAnim] = useState(false)

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty, 0
    )

    const [user, setUser] = useState(null)

    useEffect(() => {

        const getUserAndCards = async () => {

            const { data } = await supabase.auth.getUser()
            setUser(data.user)

            if (data.user) {
                const { data: cardsData } = await supabase
                    .from("cards")
                    .select("*")
                    .eq("user_id", data.user.id)

                setSavedCards(cardsData || [])
            }

        }

        getUserAndCards()

    }, [])

    const validateCard = () => {

        const clean = cardNumber.replace(/\s/g, "")

        if (clean.length !== 16) return "Kart numarası geçersiz"
        if (!/^\d{2}\/\d{2}$/.test(cardDate)) return "Son kullanma tarihi geçersiz"
        if (cardCvv.length !== 3) return "CVV geçersiz"

        return null
    }

    const createOrder = async () => {

        if (!name || !email || !address) {
            showToast("Tüm alanları doldur", "warning")
            return
        }

        if (paymentType === "saved") {

            if (!selectedCard) {
                showToast("Kart seçmelisin", "error")
                return
            }

        } else {

            const error = validateCard()

            if (error) {
                showToast(error, "error")
                return
            }

        }

        const { error } = await supabase
            .from("orders")
            .insert([{
                user_email: user?.email || email,
                products: cart,
                total_price: total,
                address
            }])

        if (error) {

            showToast("Sipariş başarısız", "error")

        } else {

            setSuccessAnim(true)
            showToast("Ödeme başarılı 🎉", "success")

            setTimeout(() => {
                navigate("/")
            }, 2000)
        }

    }

    return (

        <div className="checkoutPage">

            <h1 className="checkoutTitle">Sipariş & Ödeme</h1>

            <div className="checkoutContainer">

                <div className="checkoutLeft">

                    {/* ADRES */}
                    <div className="checkoutBox">
                        <h3>📍 Teslimat Bilgileri</h3>

                        <input placeholder="Ad Soyad" value={name} onChange={e => setName(e.target.value)} />
                        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                        <textarea placeholder="Adres" value={address} onChange={e => setAddress(e.target.value)} />
                    </div>

                    {/* 🔥 PAYMENT SWITCH */}
                    <div className="checkoutBox">

                        <h3>💳 Ödeme Yöntemi</h3>

                        <div className="paymentSwitch">

                            <label className={paymentType === "saved" ? "active" : ""}>
                                <input
                                    type="radio"
                                    checked={paymentType === "saved"}
                                    onChange={() => setPaymentType("saved")}
                                />
                                <span>Kayıtlı Kart</span>
                            </label>

                            <label className={paymentType === "new" ? "active" : ""}>
                                <input
                                    type="radio"
                                    checked={paymentType === "new"}
                                    onChange={() => setPaymentType("new")}
                                />
                                <span>Yeni Kart</span>
                            </label>

                        </div>

                    </div>

                    {/* 💳 SAVED CARDS */}
                    {paymentType === "saved" && savedCards.length > 0 && (
                        <div className="checkoutBox">

                            <h3>Kart Seç</h3>

                            {savedCards.map(card => (
                                <div
                                    key={card.id}
                                    className={`savedCard ${selectedCard?.id === card.id ? "active" : ""}`}
                                    onClick={() => setSelectedCard(card)}
                                >

                                    <div className="cardLeft">
                                        <input
                                            type="radio"
                                            checked={selectedCard?.id === card.id}
                                            readOnly
                                        />
                                    </div>

                                    <div className="cardInfo">
                                        <p>**** **** **** {card.last4}</p>
                                        <span>{card.expiry}</span>
                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                    {/* 💳 NEW CARD */}
                    {paymentType === "new" && (
                        <div className="checkoutBox">

                            <h3>💳 Kart Bilgileri</h3>

                            <input
                                placeholder="Kart Üzerindeki İsim"
                                value={cardName}
                                onChange={e => setCardName(e.target.value)}
                            />

                            <input
                                placeholder="Kart Numarası"
                                value={cardNumber}
                                onChange={e => setCardNumber(e.target.value)}
                            />

                            <div className="cardRow">
                                <input placeholder="MM/YY" value={cardDate} onChange={e => setCardDate(e.target.value)} />
                                <input placeholder="CVV" value={cardCvv} onChange={e => setCardCvv(e.target.value)} />
                            </div>

                            <p className="secureText">🔒 Demo ödeme sistemi</p>

                        </div>
                    )}

                </div>

                {/* RIGHT */}
                <div className="orderSummary">

                    <h3>Sipariş Özeti</h3>

                    <div className="orderItems">
                        {cart.map(item => (
                            <div className="orderItem" key={item.id}>
                                <img src={item.image} />
                                <div>
                                    <p>{item.name}</p>
                                    <span>{item.price.toLocaleString("tr-TR")} TL x {item.qty}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="orderTotal">
                        <p>Toplam</p>
                        <h2>{total.toLocaleString("tr-TR")} TL</h2>
                    </div>

                    <button onClick={createOrder}>
                        Siparişi Tamamla
                    </button>

                </div>

            </div>

            {/* SUCCESS */}
            {successAnim && (
                <div className="paymentSuccess">
                    <div className="check">✔</div>
                    <p>Ödeme Başarılı</p>
                </div>
            )}

        </div>
    )
}

export default Checkout