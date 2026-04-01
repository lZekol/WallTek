import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { showToast } from "../utils/toast"
import "./Profile.css"

const TABS = [
    { id: "profile", icon: "👤", label: "Profil" },
    { id: "orders", icon: "📦", label: "Siparişlerim" },
    { id: "address", icon: "📍", label: "Adreslerim" },
    { id: "cards", icon: "💳", label: "Kartlarım" },
    { id: "wishlist", icon: "❤️", label: "Favoriler" },
]

const STATUS_MAP = {
    pending: { label: "Beklemede", color: "#f59e0b" },
    shipped: { label: "Kargoda", color: "#3aa9ff" },
    delivered: { label: "Teslim Edildi", color: "#34d399" },
    cancelled: { label: "İptal", color: "#f87171" },
}

function Profile({ user, toggleWishlist, wishlist = [], addToCart }) {

    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("profile")
    const [orders, setOrders] = useState([])
    const [saving, setSaving] = useState(false)
    const [loaded, setLoaded] = useState(false)

    /* profile form */
    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")

    /* wishlist products */
    const [wishlistProducts, setWishlistProducts] = useState([])

    /* cards */
    const [cards, setCards] = useState([])
    const [cardNumber, setCardNumber] = useState("")
    const [cardExpiry, setCardExpiry] = useState("")
    const [cardCvv, setCardCvv] = useState("")
    const [cardName, setCardName] = useState("")
    const [savingCard, setSavingCard] = useState(false)

    /* ── redirect if not logged in ── */
    useEffect(() => {
        if (user === null) {
            // user henüz yüklenmemiş olabilir, kısa bekle
        }
    }, [user])

    /* ── fetch profile ── */
    useEffect(() => {
        if (!user) return
        const fetchProfile = async () => {
            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)   /* ✅ id ile sorgula, email değil */
                .single()

            if (data) {
                setFullName(data.full_name || "")
                setPhone(data.phone || "")
                setAddress(data.address || "")
            }
            setLoaded(true)
        }
        fetchProfile()
    }, [user])

    /* ── fetch orders ── */
    useEffect(() => {
        if (!user) return
        supabase
            .from("orders")
            .select("*")
            .eq("user_email", user.email)
            .order("created_at", { ascending: false })
            .then(({ data }) => setOrders(data || []))
    }, [user])

    /* ── fetch wishlist products ── */
    useEffect(() => {
        if (!wishlist || wishlist.length === 0) { setWishlistProducts([]); return }
        const ids = wishlist.map(w => w.product_id)
        supabase.from("products").select("*").in("id", ids)
            .then(({ data }) => setWishlistProducts(data || []))
    }, [wishlist])

    /* ── fetch saved cards ── */
    useEffect(() => {
        if (!user) return
        supabase
            .from("cards")
            .select("*")
            .eq("user_id", user.id)
            .then(({ data }) => setCards(data || []))
    }, [user])

    /* ── save profile ── */
    const handleSave = async () => {
        if (!user) return
        setSaving(true)
        const { error } = await supabase
            .from("profiles")
            .upsert({
                id: user.id,          /* ✅ primary key */
                email: user.email,
                full_name: fullName,
                phone: phone,
                address: address,
                updated_at: new Date().toISOString(),
            }, { onConflict: "id" })
        setSaving(false)
        if (error) showToast("Kaydedilemedi: " + error.message, "error")
        else showToast("Profil bilgilerin kaydedildi ✓", "success")
    }

    /* ── save card ── */
    const handleSaveCard = async () => {
        if (!cardNumber || !cardExpiry) {
            showToast("Kart numarası ve son kullanma tarihi gerekli", "error")
            return
        }
        setSavingCard(true)
        const last4 = cardNumber.replace(/\s/g, "").slice(-4)
        const { data, error } = await supabase
            .from("cards")
            .insert([{
                user_id: user.id,
                last4,
                expiry: cardExpiry,
                name: cardName || fullName || "Kart Sahibi",
            }])
            .select()
        setSavingCard(false)
        if (error) {
            showToast("Kart kaydedilemedi: " + error.message, "error")
        } else {
            setCards(prev => [...prev, ...(data || [])])
            setCardNumber(""); setCardExpiry(""); setCardCvv(""); setCardName("")
            showToast("Kart başarıyla kaydedildi ✓", "success")
        }
    }

    /* ── delete card ── */
    const handleDeleteCard = async (cardId) => {
        await supabase.from("cards").delete().eq("id", cardId)
        setCards(prev => prev.filter(c => c.id !== cardId))
        showToast("Kart silindi", "info")
    }

    if (!user) return (
        <section className="profilePage">
            <div className="profileLayout">
                <div style={{ padding: 40, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
                    Giriş yapılıyor…
                </div>
            </div>
        </section>
    )

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
                                {tab.id === "wishlist" && wishlist.length > 0 && (
                                    <span className="tabBadge">{wishlist.length}</span>
                                )}
                                {activeTab === tab.id && <span className="tabActiveBar" />}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* ── CONTENT ── */}
                <main className="profileContent">

                    {/* ── PROFİL ── */}
                    {activeTab === "profile" && (
                        <div className="contentCard">
                            <div className="contentCardHeader">
                                <h2>Profil Bilgileri</h2>
                                <p>Kişisel bilgilerini buradan güncelleyebilirsin.</p>
                            </div>
                            <div className="formGrid">
                                <div className="formGroup fullWidth">
                                    <label>E-posta</label>
                                    <input type="email" value={user?.email || ""} disabled className="inputDisabled" />
                                    <span className="inputHint">E-posta adresi değiştirilemez</span>
                                </div>
                                <div className="formGroup fullWidth">
                                    <label>Ad Soyad</label>
                                    <input type="text" placeholder="Adınızı ve soyadınızı girin"
                                        value={fullName} onChange={e => setFullName(e.target.value)} />
                                </div>
                                <div className="formGroup fullWidth">
                                    <label>Telefon</label>
                                    <input type="tel" placeholder="05XX XXX XX XX"
                                        value={phone} onChange={e => setPhone(e.target.value)} />
                                </div>
                                <div className="formGroup fullWidth">
                                    <label>Varsayılan Adres</label>
                                    <textarea placeholder="Adresinizi girin" value={address}
                                        onChange={e => setAddress(e.target.value)} rows={3} />
                                </div>
                            </div>
                            <div className="formActions">
                                <button className="saveBtn" onClick={handleSave} disabled={saving || !loaded}>
                                    {saving ? <><span className="spinner" /> Kaydediliyor…</> : "Değişiklikleri Kaydet"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── SİPARİŞLER ── */}
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
                                        const status = STATUS_MAP[order.status] || { label: order.status || "Beklemede", color: "#aaa" }
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
                                                    <span className="orderStatus"
                                                        style={{ color: status.color, borderColor: status.color + "44", background: status.color + "18" }}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <div className="orderProducts">
                                                    {order.products?.map((p, i) => (
                                                        <div key={i} className="orderProductChip">
                                                            <img src={p.image} alt={p.name} />
                                                            <div>
                                                                <span className="orderProductName">{p.name}</span>
                                                                <span className="orderProductPrice">{p.price?.toLocaleString("tr-TR")} TL × {p.qty}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="orderCardBottom">
                                                    <span className="orderTotal">{order.total_price?.toLocaleString("tr-TR")} TL</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── ADRES ── */}
                    {activeTab === "address" && (
                        <div className="contentCard">
                            <div className="contentCardHeader">
                                <h2>Adreslerim</h2>
                                <p>Teslimat adresini yönet.</p>
                            </div>
                            <div className="formGroup fullWidth">
                                <label>Adres</label>
                                <textarea placeholder="Adresinizi girin…" rows={4}
                                    value={address} onChange={e => setAddress(e.target.value)} />
                            </div>
                            <div className="formActions">
                                <button className="saveBtn" onClick={handleSave} disabled={saving}>
                                    {saving ? "Kaydediliyor…" : "Adres Kaydet"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── KARTLAR ── */}
                    {activeTab === "cards" && (
                        <div className="contentCard">
                            <div className="contentCardHeader">
                                <h2>Kartlarım</h2>
                                <p>Kayıtlı ödeme kartlarını yönet.</p>
                            </div>

                            {/* saved cards */}
                            {cards.length > 0 && (
                                <div className="savedCards">
                                    {cards.map(card => (
                                        <div key={card.id} className="savedCardRow">
                                            <div className="savedCardInfo">
                                                <span className="savedCardNum">**** **** **** {card.last4}</span>
                                                <span className="savedCardExp">{card.expiry} · {card.name}</span>
                                            </div>
                                            <button className="deleteCardBtn" onClick={() => handleDeleteCard(card.id)}>Sil</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* yeni kart formu */}
                            <div className="creditCardVisual">
                                <div className="ccChip" />
                                <span className="ccNumber">
                                    {cardNumber ? cardNumber.padEnd(19, " ").replace(/(.{4})/g, "$1 ").trim() : "**** **** **** ****"}
                                </span>
                                <div className="ccBottom">
                                    <span className="ccLabel">Kart Sahibi<br /><strong>{cardName || fullName || "—"}</strong></span>
                                    <span className="ccLabel">Son Kullanma<br /><strong>{cardExpiry || "AA/YY"}</strong></span>
                                </div>
                            </div>

                            <div className="formGrid">
                                <div className="formGroup fullWidth">
                                    <label>Kart Üzerindeki İsim</label>
                                    <input placeholder="Ad Soyad" value={cardName}
                                        onChange={e => setCardName(e.target.value)} />
                                </div>
                                <div className="formGroup fullWidth">
                                    <label>Kart Numarası</label>
                                    <input placeholder="XXXX XXXX XXXX XXXX" maxLength={19}
                                        value={cardNumber}
                                        onChange={e => {
                                            const v = e.target.value.replace(/\D/g, "").slice(0, 16)
                                            setCardNumber(v.replace(/(.{4})/g, "$1 ").trim())
                                        }} />
                                </div>
                                <div className="formGroup">
                                    <label>Son Kullanma</label>
                                    <input placeholder="AA/YY" maxLength={5} value={cardExpiry}
                                        onChange={e => {
                                            let v = e.target.value.replace(/\D/g, "").slice(0, 4)
                                            if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2)
                                            setCardExpiry(v)
                                        }} />
                                </div>
                                <div className="formGroup">
                                    <label>CVV</label>
                                    <input placeholder="•••" maxLength={3} type="password"
                                        value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} />
                                </div>
                            </div>
                            <div className="formActions">
                                <button className="saveBtn" onClick={handleSaveCard} disabled={savingCard}>
                                    {savingCard ? "Kaydediliyor…" : "Kart Ekle"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── FAVORİLER ── */}
                    {activeTab === "wishlist" && (
                        <div className="contentCard">
                            <div className="contentCardHeader">
                                <h2>Favorilerim</h2>
                                <p>{wishlistProducts.length} ürün favorilendi</p>
                            </div>
                            {wishlistProducts.length === 0 ? (
                                <div className="emptyState">
                                    <span className="emptyIcon">❤️</span>
                                    <p>Henüz favori ürün eklemediniz.</p>
                                </div>
                            ) : (
                                <div className="wishlistProductGrid">
                                    {wishlistProducts.map(product => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            addToCart={addToCart}
                                            toggleWishlist={toggleWishlist}
                                            wishlist={wishlist}
                                            user={user}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </main>
            </div>
        </section>
    )
}

export default Profile