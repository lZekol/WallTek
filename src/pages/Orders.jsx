import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"
import "./Orders.css"

const STATUS_MAP = {
    pending: { label: "Beklemede", color: "#f59e0b" },
    shipped: { label: "Kargoda", color: "#3aa9ff" },
    delivered: { label: "Teslim Edildi", color: "#34d399" },
    cancelled: { label: "İptal", color: "#f87171" },
}

function Orders({ user }) {

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const getOrders = async () => {
            setLoading(true)

            /* user prop yoksa supabase'den al */
            let currentUser = user
            if (!currentUser) {
                const { data } = await supabase.auth.getUser()
                currentUser = data.user
            }

            if (!currentUser) { setLoading(false); return }

            const { data } = await supabase
                .from("orders")
                .select("*")
                .eq("user_email", currentUser.email)
                .order("created_at", { ascending: false })

            setOrders(data || [])
            setLoading(false)
        }
        getOrders()
    }, [user])

    return (
        <div className="ordersPage">

            <div className="ordersPageHeader">
                <h1>Siparişlerim</h1>
                <span className="ordersCount">{loading ? "…" : `${orders.length} sipariş`}</span>
            </div>

            {loading ? (
                <div className="ordersContainer">
                    {Array(3).fill(null).map((_, i) => (
                        <div key={i} className="orderSkeleton" />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="ordersEmpty">
                    <span className="ordersEmptyIcon">📦</span>
                    <h3>Henüz siparişiniz yok</h3>
                    <p>Verdiğiniz siparişler burada listelenecek.</p>
                    <button className="ordersShopBtn" onClick={() => navigate("/")}>
                        Alışverişe Başla
                    </button>
                </div>
            ) : (
                <div className="ordersContainer">
                    {orders.map(order => {
                        const status = STATUS_MAP[order.status] || { label: order.status || "Beklemede", color: "#aaa" }
                        return (
                            <div className="orderCard" key={order.id}>

                                <div className="orderCardTop">
                                    <div className="orderCardLeft">
                                        <span className="orderCardId">
                                            Sipariş #{String(order.id).slice(-6).toUpperCase()}
                                        </span>
                                        <span className="orderCardDate">
                                            {new Date(order.created_at).toLocaleDateString("tr-TR", {
                                                day: "numeric", month: "long", year: "numeric"
                                            })}
                                        </span>
                                    </div>
                                    <span
                                        className="orderCardStatus"
                                        style={{
                                            color: status.color,
                                            borderColor: status.color + "44",
                                            background: status.color + "18"
                                        }}
                                    >
                                        {status.label}
                                    </span>
                                </div>

                                <div className="orderCardProducts">
                                    {order.products?.map((p, i) => (
                                        <div key={i} className="orderProductRow">
                                            <img src={p.image} alt={p.name} />
                                            <div className="orderProductInfo">
                                                <span className="orderProductName">{p.name}</span>
                                                <span className="orderProductPrice">
                                                    {p.price?.toLocaleString("tr-TR")} TL
                                                    {p.qty > 1 && ` × ${p.qty}`}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="orderCardFooter">
                                    <span className="orderCardTotal">
                                        Toplam: <strong>{order.total_price?.toLocaleString("tr-TR")} TL</strong>
                                    </span>
                                </div>

                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Orders