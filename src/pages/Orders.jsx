import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import "./Orders.css"

function Orders() {

    const [orders, setOrders] = useState([])

    useEffect(() => {

        const getOrders = async () => {

            const { data: userData } = await supabase.auth.getUser()
            const user = userData.user

            if (!user) return

            const { data } = await supabase
                .from("orders")
                .select("*")
                .eq("user_email", user.email)
                .order("created_at", { ascending: false })

            setOrders(data || [])

        }

        getOrders()

    }, [])

    return (

        <div className="ordersPage">

            <h1>Siparişlerim</h1>

            <div className="ordersContainer">

                {orders.length === 0 ? (

                    <p>Henüz siparişiniz yok.</p>

                ) : (

                    orders.map(order => (

                        <div className="orderCard" key={order.id}>

                            <div className="orderHeader">

                                <span>
                                    Tarih: {new Date(order.created_at).toLocaleDateString()}
                                </span>

                                <span>
                                    Toplam: {order.total_price.toLocaleString("tr-TR")} TL
                                </span>

                            </div>

                            <div className="orderProducts">

                                {order.products.map(product => (

                                    <div className="orderProduct" key={product.id}>

                                        <img src={product.image} />

                                        <div>

                                            <p>{product.name}</p>

                                            <span>
                                                {product.price.toLocaleString("tr-TR")} TL x {product.qty}
                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    )

}

export default Orders