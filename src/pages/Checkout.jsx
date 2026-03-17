import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "./Checkout.css"

function Checkout({ cart }) {

    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")

    // 💳 PAYMENT
    const [cardName, setCardName] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [cardDate, setCardDate] = useState("")
    const [cardCvv, setCardCvv] = useState("")

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty, 0
    )

    const createOrder = async () => {

        if (!name || !email || !address || !cardNumber) {
            alert("Tüm alanları doldur")
            return
        }

        const { error } = await supabase
            .from("orders")
            .insert([{
                user_email: email,
                products: cart,
                total_price: total,
                address
            }])

        if (error) {

            alert("Sipariş başarısız")

        } else {

            alert("Sipariş alındı 🎉")
            localStorage.removeItem("guest")
            navigate("/")

        }

    }

    return (

        <div className="checkoutPage">

            <h1 className="checkoutTitle">
                Sipariş & Ödeme
            </h1>

            <div className="checkoutContainer">

                {/* LEFT */}
                <div className="checkoutLeft">

                    {/* ADRES */}
                    <div className="checkoutBox">

                        <h3>📍 Teslimat Bilgileri</h3>

                        <input
                            placeholder="Ad Soyad"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <textarea
                            placeholder="Adres"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />

                    </div>

                    {/* PAYMENT */}
                    <div className="checkoutBox">

                        <h3>💳 Ödeme Bilgileri</h3>

                        <input
                            placeholder="Kart Üzerindeki İsim"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                        />

                        <input
                            placeholder="Kart Numarası"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                        />

                        <div className="cardRow">

                            <input
                                placeholder="MM/YY"
                                value={cardDate}
                                onChange={(e) => setCardDate(e.target.value)}
                            />

                            <input
                                placeholder="CVV"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                            />

                        </div>

                        <p className="secureText">
                            🔒 Güvenli ödeme - bilgileriniz saklanmaz
                        </p>

                    </div>

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

                                    <span>
                                        {item.price.toLocaleString("tr-TR")} TL x {item.qty}
                                    </span>

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

        </div>

    )

}

export default Checkout