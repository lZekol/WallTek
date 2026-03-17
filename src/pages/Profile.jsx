import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import "./Profile.css"

function Profile() {

    const [activeTab, setActiveTab] = useState("profile")
    const [user, setUser] = useState(null)
    const [orders, setOrders] = useState([])

    useEffect(() => {

        const getUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data.user)
        }

        getUser()

    }, [])

    useEffect(() => {

        const getOrders = async () => {

            const { data: userData } = await supabase.auth.getUser()

            if (!userData.user) return

            const { data } = await supabase
                .from("orders")
                .select("*")
                .eq("user_email", userData.user.email)
                .order("created_at", { ascending: false })

            setOrders(data || [])

        }

        getOrders()

    }, [])

    return (

        <section className="profilePage">

            <div className="dashboard">

                {/* SIDEBAR */}
                <div className="sidebar">

                    <h3>Hesabım</h3>

                    <button
                        className={activeTab === "profile" ? "active" : ""}
                        onClick={() => setActiveTab("profile")}
                    >
                        👤 Profil
                    </button>

                    <button
                        className={activeTab === "orders" ? "active" : ""}
                        onClick={() => setActiveTab("orders")}
                    >
                        📦 Siparişlerim
                    </button>

                    <button
                        className={activeTab === "address" ? "active" : ""}
                        onClick={() => setActiveTab("address")}
                    >
                        📍 Adreslerim
                    </button>

                    <button
                        className={activeTab === "cards" ? "active" : ""}
                        onClick={() => setActiveTab("cards")}
                    >
                        💳 Kartlarım
                    </button>

                    <button
                        className={activeTab === "wishlist" ? "active" : ""}
                        onClick={() => setActiveTab("wishlist")}
                    >
                        ❤️ Favoriler
                    </button>

                </div>

                {/* CONTENT */}
                <div className="content">

                    {/* PROFIL */}
                    {activeTab === "profile" && (

                        <div className="cardBox">

                            <h2>Profil Bilgileri</h2>

                            <input defaultValue={user?.email} />

                            <input placeholder="Ad Soyad" />

                            <input placeholder="Telefon" />

                            <textarea placeholder="Adres" />

                            <button className="saveBtn">Kaydet</button>

                        </div>

                    )}

                    {/* SIPARISLER */}
                    {activeTab === "orders" && (

                        <div className="cardBox">

                            <h2>Siparişlerim</h2>

                            {orders.length === 0 ? (

                                <p>Henüz sipariş yok</p>

                            ) : (

                                orders.map(order => (

                                    <div className="orderCard" key={order.id}>

                                        <div className="orderTop">

                                            <p>#{order.id}</p>
                                            <span>{order.status}</span>

                                        </div>

                                        <small>
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </small>

                                        <div className="orderProducts">

                                            {order.products.map((p, i) => (

                                                <div key={i} className="orderItemMini">

                                                    <img src={p.image} />
                                                    <span>{p.name}</span>

                                                </div>

                                            ))}

                                        </div>

                                        <h4>
                                            {order.total_price.toLocaleString("tr-TR")} TL
                                        </h4>

                                    </div>

                                ))

                            )}

                        </div>

                    )}

                    {/* ADRES */}
                    {activeTab === "address" && (

                        <div className="cardBox">

                            <h2>Adreslerim</h2>

                            <textarea placeholder="Yeni adres ekle" />

                            <button className="saveBtn">Adres Kaydet</button>

                        </div>

                    )}

                    {/* KART */}
                    {activeTab === "cards" && (

                        <div className="cardBox">

                            <h2>Kartlarım</h2>

                            <div className="creditCard">

                                <p>**** **** **** 4242</p>
                                <span>12/26</span>

                            </div>

                            <input placeholder="Kart Numarası" />
                            <input placeholder="MM/YY" />

                            <button className="saveBtn">Kart Kaydet</button>

                        </div>

                    )}

                    {/* FAVORILER */}
                    {activeTab === "wishlist" && (

                        <div className="cardBox">

                            <h2>Favoriler</h2>

                            <p>Favori ürünleriniz burada listelenecek.</p>

                        </div>

                    )}

                </div>

            </div>

        </section>

    )

}

export default Profile