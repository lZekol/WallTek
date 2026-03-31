import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { showToast } from "../utils/toast"
import "./Profile.css"

/* ── tab config ── */
const TABS = [
    { id: "profile", icon: "👤", label: "Profil" },
    { id: "orders", icon: "📦", label: "Siparişlerim" },
    { id: "address", icon: "📍", label: "Adreslerim" },
    { id: "cards", icon: "💳", label: "Kartlarım" },
    { id: "wishlist", icon: "❤️", label: "Favoriler" },
]

/* ── order status badge colors ── */
const STATUS_MAP = {
    "pending": { label: "Beklemede", color: "#f59e0b" },
    "shipped": { label: "Kargoda", color: "#3aa9ff" },
    "delivered": { label: "Teslim Edildi", color: "#34d399" },
    "cancelled": { label: "İptal", color: "#f87171" },
}

function Profile() {

    const [activeTab, setActiveTab] = useState("profile")
    const [user, setUser] = useState(null)
    const [orders, setOrders] = useState([])
    const [saving, setSaving] = useState(false)

    /* profile form state */
    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [loaded, setLoaded] = useState(false)

    /* ── fetch user + profile ── */
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            setUser(user)

            /* profiles tablosundan kayıtlı bilgileri çek */
            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single()

            if (profile) {
                setFullName(profile.full_name || "")
                setPhone(profile.phone || "")
                setAddress(profile.address || "")
            }
            setLoaded(true)
        }
        init()
    }, [])

    /* ── fetch orders ── */
    useEffect(() => {
        const getOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser()
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

    /* ── save profile ── */
    const handleSave = async () => {
        if (!user) return
        setSaving(true)

        const { error } = await supabase
            .from("profiles")
            .upsert({
                id: user.id,
                full_name: fullName,
                phone: phone,
                address: address,
                updated_at: new Date().toISOString(),
            }, { onConflict: "id" })

        setSaving(false)

        if (error) {
            showToast("Kaydedilemedi: " + error.message, "error")
        } else {
            showToast("Profil bilgilerin kaydedildi ✓", "success")
        }
    }

    return (
        <section className="profilePage">
            <div className="profileLayout">

                {/* ── SIDEBAR ── */}
                <aside className="profileSidebar">
                    <div className="sidebarHeader">
                        <div className="avatarCircle">
                            {user?.email?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div className="sidebarUserInfo">
                            <span className="sidebarName">{fullName || "Kullanıcı"}</span>
                            <span className="sidebarEmail">{user?.email}</span>
                        </div>
                    </div>

                    <nav className="sidebarNav">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                className={`sidebarTab${activeTab === tab.id ? " sidebarTabActive" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="tabIcon">{tab.icon}</span>
                                <span>{tab.label}</span>
                                {activeTab === tab.id && <span className="tabActiveBar" />}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* ── CONTENT ── */}
                <main className="profileContent">

                    {/* ── PROFILE ── */}
                    {activeTab === "profile" && (
                        <div className="contentCard">
                            <div className="contentCardHeader">
                                <h2>Profil Bilgileri</h2>
                                <p>Kişisel bilgilerini buradan güncelleyebilirsin.</p>
                            </div>

                            <div className="formGrid">

                                <div className="formGroup fullWidth">
                                    <label>E-posta</label>
                                    <input
                                        type="email"
                                        value={user?.email || ""}
                                        disabled
                                        className="inputDisabled"
                                    />
                                    <span className="inputHint">E-posta adresi değiştirilemez</span>
                                </div>

                                <div className="formGroup fullWidth">
                                    <label>Ad Soyad</label>
                                    <input
                                        type="text"
                                        placeholder="Adınızı ve soyadınızı girin"
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                    />
                                </div>

                                <div className="formGroup fullWidth">
                                    <label>Telefon</label>
                                    <input
                                        type="tel"
                                        placeholder="05XX XXX XX XX"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                    />
                                </div>

                                <div className="formGroup fullWidth">
                                    <label>Varsayılan Adres</label>
                                    <textarea
                                        placeholder="Adresinizi girin"
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        rows={3}
                                    />
                                </div>

                            </div>

                            <div className="formActions">
                                <button
                                    className="saveBtn"
                                    onClick={handleSave}
                                    disabled={saving || !loaded}
                                >
                                    {saving ? (
                                        <><span className="spinner" /> Kaydediliyor…</>
                                    ) : "Değişiklikleri Kaydet"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── ORDERS ── */}
                    {activeTab === "orders" && (
                        <div className="contentCard">
                            <div className="contentCardHeader">
                                <h2>Siparişlerim</h2>
                                <p>{orders.length} sipariş bulundu</p>
                            </div>

                            {orders.length === 0 ? (
                                <div className="emptyState">
                                    <span className="emptyIcon">📦</span>
                                    <p>Henüz hiç sipariş vermediniz.</p>
                                </div>
                            ) : (
                                <div className="orderList">
                                    {orders.map(order => {
                                        const status = STATUS_MAP[order.status] || { label: order.status, color: "#aaa" }
                                        return (
                                            <div className="orderCard" key={order.id}>
                                                <div className="orderCardTop">
                                                    <div>
                                                        <span className="orderId">#{String(order.id).slice(-6).toUpperCase()}</span>
                                                        <span className="orderDate">
                                                            {new Date(order.created_at).toLocaleDateString("tr-TR", {
                                                                day: "numeric", month: "long", year: "numeric"
                                                            })}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className="orderStatus"
                                                        style={{ color: status.color, borderColor: status.color + "44", background: status.color + "18" }}
                                                    >
                                                        {status.label}
                                                    </span>
                                                </div>

                                                <div className="orderProducts">
                                                    {order.products?.map((p, i) => (
                                                        <div key={i} className="orderProductChip">
                                                            <img src={p.image} alt={p.name} />
                                                            <span>{p.name}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="orderCardBottom">
                                                    <span className="orderTotal">
                                                        {order.total_price?.toLocaleString("tr-TR")} TL
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── ADDRESS ── */}
                    {activeTab === "address" && (
                        <div className="contentCard">
                            <div className="contentCardHeader">
                                <h2>Adreslerim</h2>
                                <p>Teslimat adreslerini yönet.</p>
                            </div>
                            <div className="formGroup fullWidth">
                                <label>Adres</label>
                                <textarea
                                    placeholder="Yeni adres ekle…"
                                    rows={4}
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                />
                            </div>
                            <div className="formActions">
                                <button className="saveBtn" onClick={handleSave} disabled={saving}>
                                    {saving ? "Kaydediliyor…" : "Adres Kaydet"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── CARDS ── */}
                    {activeTab === "cards" && (
                        <div className="contentCard">
                            <div className="contentCardHeader">
                                <h2>Kartlarım</h2>
                                <p>Kayıtlı ödeme kartlarını yönet.</p>
                            </div>

                            <div className="creditCardVisual">
                                <div className="ccChip" />
                                <span className="ccNumber">**** **** **** 4242</span>
                                <div className="ccBottom">
                                    <span className="ccLabel">Kart Sahibi<br /><strong>{fullName || "—"}</strong></span>
                                    <span className="ccLabel">Son Kullanma<br /><strong>12/26</strong></span>
                                </div>
                            </div>

                            <div className="formGrid">
                                <div className="formGroup fullWidth">
                                    <label>Kart Numarası</label>
                                    <input placeholder="XXXX XXXX XXXX XXXX" maxLength={19} />
                                </div>
                                <div className="formGroup">
                                    <label>Son Kullanma</label>
                                    <input placeholder="AA/YY" maxLength={5} />
                                </div>
                                <div className="formGroup">
                                    <label>CVV</label>
                                    <input placeholder="•••" maxLength={3} type="password" />
                                </div>
                            </div>

                            <div className="formActions">
                                <button className="saveBtn">Kart Ekle</button>
                            </div>
                        </div>
                    )}

                    {/* ── WISHLIST ── */}
                    {activeTab === "wishlist" && (
                        <div className="contentCard">
                            <div className="contentCardHeader">
                                <h2>Favorilerim</h2>
                                <p>Beğendiğin ürünler burada saklanır.</p>
                            </div>
                            <div className="emptyState">
                                <span className="emptyIcon">❤️</span>
                                <p>Henüz favori ürün eklemediniz.</p>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </section>
    )
}

export default Profile