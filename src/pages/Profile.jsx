import { useState } from "react"
import "./Profile.css"

function Profile() {

    const [activeTab, setActiveTab] = useState("profile")

    return (

        <section className="profilePage">

            <div className="dashboard">

                {/* SIDEBAR */}

                <div className="sidebar">

                    <h3>Hesabım</h3>

                    <button onClick={() => setActiveTab("profile")}>👤 Profil</button>

                    <button onClick={() => setActiveTab("orders")}>📦 Siparişlerim</button>

                    <button onClick={() => setActiveTab("address")}>📍 Adreslerim</button>

                    <button onClick={() => setActiveTab("cards")}>💳 Kartlarım</button>

                    <button onClick={() => setActiveTab("wishlist")}>❤️ Favoriler</button>

                </div>


                {/* CONTENT */}

                <div className="content">


                    {/* PROFIL */}

                    {activeTab === "profile" && (

                        <div className="profileForm">

                            <h2>Profil Bilgileri</h2>

                            <input placeholder="Ad Soyad" />

                            <input placeholder="Telefon" />

                            <textarea placeholder="Adres" />

                            <button className="saveBtn">Kaydet</button>

                        </div>

                    )}



                    {/* SIPARISLER */}

                    {activeTab === "orders" && (

                        <div className="panel">

                            <h2>Siparişlerim</h2>

                            <p>Henüz siparişiniz yok.</p>

                        </div>

                    )}



                    {/* ADRESLER */}

                    {activeTab === "address" && (

                        <div className="panel">

                            <h2>Adreslerim</h2>

                            <textarea placeholder="Yeni adres ekle" />

                            <button className="saveBtn">Adres Kaydet</button>

                        </div>

                    )}



                    {/* KARTLAR */}

                    {activeTab === "cards" && (

                        <div className="panel">

                            <h2>Kartlarım</h2>

                            <input placeholder="Kart Numarası" />

                            <input placeholder="Son Kullanma Tarihi" />

                            <button className="saveBtn">Kart Kaydet</button>

                        </div>

                    )}



                    {/* FAVORILER */}

                    {activeTab === "wishlist" && (

                        <div className="panel">

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