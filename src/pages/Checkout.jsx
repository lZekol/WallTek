import { useState } from "react"
import { supabase } from "../lib/supabase"
import "./Checkout.css"

function Checkout({ cart }) {

    const [address, setAddress] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty, 0
    )

    const createOrder = async () => {

        const { error } = await supabase
            .from("orders")
            .insert([{

                user_email: email,
                products: cart,
                total_price: total,
                address: address

            }])

        if (error) {

            alert("Sipariş oluşturulamadı")

        } else {

            alert("Sipariş başarıyla oluşturuldu")

        }

    }

    return (

        <div className="checkoutPage">

            <h1 className="checkoutTitle">Checkout</h1>

            <div className="checkoutContainer">

                <div className="checkoutForm">

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