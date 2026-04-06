import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import "./Admin.css"

const TABS = [
    { id: "stats", icon: "📊", label: "İstatistikler" },
    { id: "products", icon: "📦", label: "Ürünler" },
    { id: "orders", icon: "🚚", label: "Siparişler" },
    { id: "users", icon: "👥", label: "Kullanıcılar" },
    { id: "reviews", icon: "💬", label: "Yorumlar" },
]

const CATEGORIES = ["gpu", "laptop", "monitor", "headset", "mouse", "keyboard", "tv"]

const STATUS_OPTIONS = [
    { value: "pending", label: "Beklemede", color: "#f59e0b" },
    { value: "shipped", label: "Kargoda", color: "#3aa9ff" },
    { value: "delivered", label: "Teslim Edildi", color: "#34d399" },
    { value: "cancelled", label: "İptal", color: "#f87171" },
]

function StatCard({ label, value, color = "#3aa9ff" }) {
    return (
        <div className="statCard">
            <span className="statLabel">{label}</span>
            <span className="statValue" style={{ color }}>{value}</span>
        </div>
    )
}

function Admin() {
    const navigate = useNavigate()

    /* ── auth guard ── */
    const [authChecked, setAuthChecked] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { navigate("/login"); return }

            const { data: profile } = await supabase
                .from("profiles")
                .select("is_admin")
                .eq("id", user.id)
                .single()

            if (!profile?.is_admin) {
                navigate("/")   /* admin değilse ana sayfaya at */
                return
            }

            setIsAdmin(true)
            setAuthChecked(true)
        }
        checkAdmin()
    }, [])

    const [activeTab, setActiveTab] = useState("stats")

    /* ── products ── */
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState("")
    const [editPrice, setEditPrice] = useState({})
    const [editOldPrice, setEditOldPrice] = useState({})
    const [form, setForm] = useState({
        name: "", price: "", oldPrice: "", image: "",
        category: "gpu", featured: false, description: ""
    })
    const [addMsg, setAddMsg] = useState(null)

    /* ── orders ── */
    const [orders, setOrders] = useState([])
    const [orderSearch, setOrderSearch] = useState("")
    const [orderFilter, setOrderFilter] = useState("all")
    /* sipariş durumu güncelleme için local state */
    const [orderStatuses, setOrderStatuses] = useState({})
    const [savingOrder, setSavingOrder] = useState(null)

    /* ── users ── */
    const [users, setUsers] = useState([])

    /* ── reviews ── */
    const [reviews, setReviews] = useState([])
    const [reviewFilter, setReviewFilter] = useState("all")

    useEffect(() => {
        if (!authChecked) return
        fetchProducts()
        fetchOrders()
        fetchUsers()
        fetchReviews()
    }, [authChecked])

    /* ── fetchers ── */
    const fetchProducts = async () => {
        const { data } = await supabase.from("products").select("*").order("id", { ascending: false })
        if (data) setProducts(data)
    }

    const fetchOrders = async () => {
        const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false })
        if (data) {
            setOrders(data)
            /* local status map'i başlat */
            const map = {}
            data.forEach(o => { map[o.id] = o.status || "pending" })
            setOrderStatuses(map)
        }
    }

    const fetchUsers = async () => {
        const { data } = await supabase.from("profiles").select("*").order("updated_at", { ascending: false })
        if (data) setUsers(data)
    }

    const fetchReviews = async () => {
        const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false })
        if (data) setReviews(data)
    }

    /* ── product actions ── */
    const addProduct = async () => {
        const { name, price, oldPrice, image, category, featured, description } = form
        if (!name || !price || !image) { setAddMsg({ type: "error", text: "Ad, fiyat ve görsel zorunlu" }); return }
        const parsedPrice = Number(price)
        const parsedOldPrice = oldPrice ? Number(oldPrice) : null
        if (isNaN(parsedPrice)) { setAddMsg({ type: "error", text: "Fiyat geçersiz" }); return }

        const { error } = await supabase.from("products").insert([{
            name: name.trim(),
            price: parsedPrice,
            old_price: parsedOldPrice,
            image: image.startsWith("/") ? image : `/images/${image.trim()}`,
            category, featured,
            description: description.trim() || null
        }])

        if (error) {
            setAddMsg({ type: "error", text: "Eklenemedi: " + error.message })
        } else {
            setAddMsg({ type: "success", text: `"${name}" eklendi ✓` })
            setForm({ name: "", price: "", oldPrice: "", image: "", category: "gpu", featured: false, description: "" })
            fetchProducts()
        }
        setTimeout(() => setAddMsg(null), 3000)
    }

    const updatePrice = async (id) => {
        const newPrice = editPrice[id]
        const newOldPrice = editOldPrice[id]
        if (!newPrice) return
        await supabase.from("products").update({
            price: Number(newPrice),
            ...(newOldPrice ? { old_price: Number(newOldPrice) } : {})
        }).eq("id", id)
        setEditPrice(p => { const c = { ...p }; delete c[id]; return c })
        setEditOldPrice(p => { const c = { ...p }; delete c[id]; return c })
        fetchProducts()
    }

    const toggleFeatured = async (p) => {
        await supabase.from("products").update({ featured: !p.featured }).eq("id", p.id)
        fetchProducts()
    }
    const toggleCampaign = async (p) => {
        await supabase.from("products").update({ is_campaign: !p.is_campaign }).eq("id", p.id)
        fetchProducts()
    }
    const deleteProduct = async (id) => {
        if (!window.confirm("Ürünü sil?")) return
        await supabase.from("products").delete().eq("id", id)
        fetchProducts()
    }

    /* ── sipariş durumu güncelle ── */
    const saveOrderStatus = async (orderId) => {
        const newStatus = orderStatuses[orderId]
        setSavingOrder(orderId)
        const { error } = await supabase
            .from("orders")
            .update({ status: newStatus })
            .eq("id", orderId)
        setSavingOrder(null)
        if (error) alert("Güncelleme başarısız: " + error.message)
        else fetchOrders()
    }

    /* ── review actions ── */
    const deleteReview = async (id) => {
        await supabase.from("reviews").delete().eq("id", id)
        fetchReviews()
    }

    /* ── filters ── */
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    const filteredOrders = orders.filter(o => {
        const matchSearch = orderSearch
            ? (o.user_email?.toLowerCase().includes(orderSearch.toLowerCase()) || String(o.id).includes(orderSearch))
            : true
        const matchStatus = orderFilter === "all" ? true : (o.status || "pending") === orderFilter
        return matchSearch && matchStatus
    })

    const filteredReviews = reviewFilter === "all" ? reviews
        : reviews.filter(r => r.rating <= Number(reviewFilter))

    /* ── stats ── */
    const totalRevenue = orders.reduce((s, o) => s + (o.total_price || 0), 0)
    const topProducts = [...products].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 5)

    /* ── loading / access denied ── */
    if (!authChecked) {
        return (
            <div style={{ minHeight: "100vh", background: "#04040f", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", fontFamily: "DM Sans,sans-serif" }}>
                Yetki kontrol ediliyor…
            </div>
        )
    }

    return (
        <div className="adminPage">

            {/* sidebar */}
            <aside className="adminSidebar">
                <div className="adminBrand"><span>⚙</span><span>Admin</span></div>
                <nav className="adminNav">
                    {TABS.map(t => (
                        <button key={t.id}
                            className={`adminNavBtn${activeTab === t.id ? " active" : ""}`}
                            onClick={() => setActiveTab(t.id)}
                        >
                            <span className="adminNavIcon">{t.icon}</span>
                            <span>{t.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="adminMain">

                {/* ── İSTATİSTİKLER ── */}
                {activeTab === "stats" && (
                    <div className="adminSection">
                        <h2 className="adminSectionTitle">İstatistikler</h2>
                        <div className="statsGrid">
                            <StatCard label="Toplam Gelir" value={totalRevenue.toLocaleString("tr-TR") + " TL"} color="#3aa9ff" />
                            <StatCard label="Sipariş" value={orders.length} color="#34d399" />
                            <StatCard label="Kullanıcı" value={users.length} color="#a78bfa" />
                            <StatCard label="Ürün" value={products.length} color="#fb923c" />
                        </div>
                        <div className="statsRow">
                            <div className="statsBox">
                                <h3>Sipariş Durumları</h3>
                                {STATUS_OPTIONS.map(s => {
                                    const count = orders.filter(o => (o.status || "pending") === s.value).length
                                    const pct = orders.length ? Math.round((count / orders.length) * 100) : 0
                                    return (
                                        <div key={s.value} className="statsBarRow">
                                            <span className="statsBarLabel" style={{ color: s.color }}>{s.label}</span>
                                            <div className="statsBarTrack">
                                                <div className="statsBarFill" style={{ width: pct + "%", background: s.color }} />
                                            </div>
                                            <span className="statsBarCount">{count}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="statsBox">
                                <h3>Son Siparişler</h3>
                                {orders.slice(0, 5).map(o => (
                                    <div key={o.id} className="statsOrderRow">
                                        <span className="statsOrderId">#{String(o.id).slice(-5).toUpperCase()}</span>
                                        <span className="statsOrderEmail">{o.user_email}</span>
                                        <span className="statsOrderTotal">{o.total_price?.toLocaleString("tr-TR")} TL</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── ÜRÜNLER ── */}
                {activeTab === "products" && (
                    <div className="adminSection">
                        <h2 className="adminSectionTitle">Ürün Yönetimi</h2>

                        <div className="adminFormBox">
                            <h3>Yeni Ürün Ekle</h3>
                            {addMsg && <div className={`adminMsg adminMsg--${addMsg.type}`}>{addMsg.text}</div>}
                            <div className="adminFormGrid">
                                <div className="adminField">
                                    <label>Ürün Adı *</label>
                                    <input placeholder="RTX 4090" value={form.name}
                                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                                </div>
                                <div className="adminField">
                                    <label>Fiyat (TL) *</label>
                                    <input type="number" placeholder="29999" value={form.price}
                                        onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                                </div>
                                <div className="adminField">
                                    <label>İndirim Öncesi Fiyat</label>
                                    <input type="number" placeholder="35999" value={form.oldPrice}
                                        onChange={e => setForm(p => ({ ...p, oldPrice: e.target.value }))} />
                                </div>
                                <div className="adminField">
                                    <label>Görsel yolu *</label>
                                    <input placeholder="/images/rtx4090.png" value={form.image}
                                        onChange={e => setForm(p => ({ ...p, image: e.target.value }))} />
                                </div>
                                <div className="adminField">
                                    <label>Kategori</label>
                                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div className="adminField adminField--full">
                                    <label>Açıklama</label>
                                    <textarea placeholder="Ürün açıklaması..." value={form.description}
                                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} />
                                </div>
                                <div className="adminField adminField--row">
                                    <label className="adminToggleLabel">
                                        <input type="checkbox" checked={form.featured}
                                            onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
                                        Popüler ürün (anasayfada çıkar)
                                    </label>
                                </div>
                            </div>
                            {form.image && (
                                <img src={form.image.startsWith("/") ? form.image : `/images/${form.image}`}
                                    alt="önizleme" className="adminImgPreview" />
                            )}
                            <button className="adminPrimaryBtn" onClick={addProduct}>Ürün Ekle</button>
                        </div>

                        <div className="adminListHeader">
                            <input className="adminSearchInput" placeholder="Ürün ara..."
                                value={search} onChange={e => setSearch(e.target.value)} />
                            <span className="adminCount">{filteredProducts.length} ürün</span>
                        </div>

                        <div className="adminTable">
                            <div className="adminTableHead">
                                <span>Ürün</span><span>Kategori</span><span>Fiyat</span>
                                <span>Fiyat Güncelle</span><span>Etiketler</span><span>İşlem</span>
                            </div>
                            {filteredProducts.map(product => (
                                <div className="adminTableRow" key={product.id}>
                                    <div className="adminTableProduct">
                                        <img src={product.image} alt={product.name} />
                                        <span>{product.name}</span>
                                    </div>
                                    <span className="adminTableCat">{product.category}</span>
                                    <div className="adminTablePrices">
                                        <span className="adminTableNewPrice">{product.price?.toLocaleString("tr-TR")} TL</span>
                                        {product.old_price && <span className="adminTableOldPrice">{product.old_price?.toLocaleString("tr-TR")} TL</span>}
                                    </div>
                                    <div className="adminTableEdit">
                                        <input type="number" placeholder="Yeni fiyat"
                                            value={editPrice[product.id] || ""}
                                            onChange={e => setEditPrice(p => ({ ...p, [product.id]: e.target.value }))} />
                                        <input type="number" placeholder="İndirim öncesi"
                                            value={editOldPrice[product.id] || ""}
                                            onChange={e => setEditOldPrice(p => ({ ...p, [product.id]: e.target.value }))} />
                                        <button className="adminSmallBtn adminSmallBtn--green"
                                            onClick={() => updatePrice(product.id)}>Kaydet</button>
                                    </div>
                                    <div className="adminTableTags">
                                        <button className={`adminTag${product.featured ? " adminTag--on" : ""}`}
                                            onClick={() => toggleFeatured(product)}>★ Popüler</button>
                                        <button className={`adminTag${product.is_campaign ? " adminTag--campaign" : ""}`}
                                            onClick={() => toggleCampaign(product)}>🏷 Kampanya</button>
                                    </div>
                                    <div className="adminTableActions">
                                        <button className="adminSmallBtn adminSmallBtn--red"
                                            onClick={() => deleteProduct(product.id)}>Sil</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── SİPARİŞLER ── */}
                {activeTab === "orders" && (
                    <div className="adminSection">
                        <h2 className="adminSectionTitle">Sipariş Yönetimi</h2>

                        <div className="adminListHeader">
                            <input className="adminSearchInput" placeholder="E-posta veya sipariş ID ara..."
                                value={orderSearch} onChange={e => setOrderSearch(e.target.value)} />
                            <div className="adminFilterPills">
                                {["all", ...STATUS_OPTIONS.map(s => s.value)].map(v => (
                                    <button key={v}
                                        className={`filterPill${orderFilter === v ? " filterPill--active" : ""}`}
                                        onClick={() => setOrderFilter(v)}
                                    >
                                        {v === "all" ? "Tümü" : STATUS_OPTIONS.find(s => s.value === v)?.label}
                                    </button>
                                ))}
                            </div>
                            <span className="adminCount">{filteredOrders.length} sipariş</span>
                        </div>

                        <div className="adminOrderList">
                            {filteredOrders.length === 0 && (
                                <div style={{ color: "rgba(255,255,255,0.3)", padding: "40px 0", textAlign: "center" }}>
                                    Sipariş bulunamadı
                                </div>
                            )}
                            {filteredOrders.map(order => {
                                const currentStatus = orderStatuses[order.id] || order.status || "pending"
                                const statusObj = STATUS_OPTIONS.find(s => s.value === currentStatus) || STATUS_OPTIONS[0]
                                const isDirty = currentStatus !== (order.status || "pending")
                                return (
                                    <div className="adminOrderCard" key={order.id}>
                                        <div className="adminOrderTop">
                                            <div>
                                                <span className="adminOrderId">#{String(order.id).slice(-6).toUpperCase()}</span>
                                                <span className="adminOrderDate">
                                                    {new Date(order.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                                                </span>
                                                <span className="adminOrderEmail">{order.user_email}</span>
                                            </div>
                                            <div className="adminOrderRight">
                                                <span className="adminOrderTotal">{order.total_price?.toLocaleString("tr-TR")} TL</span>
                                                {/* ✅ Dropdown + Kaydet butonu */}
                                                <div className="orderStatusControl">
                                                    <select
                                                        className="adminStatusSelect"
                                                        value={currentStatus}
                                                        style={{ borderColor: statusObj.color + "66", color: statusObj.color }}
                                                        onChange={e => setOrderStatuses(p => ({ ...p, [order.id]: e.target.value }))}
                                                    >
                                                        {STATUS_OPTIONS.map(s => (
                                                            <option key={s.value} value={s.value}>{s.label}</option>
                                                        ))}
                                                    </select>
                                                    {isDirty && (
                                                        <button
                                                            className="adminSmallBtn adminSmallBtn--green orderSaveBtn"
                                                            onClick={() => saveOrderStatus(order.id)}
                                                            disabled={savingOrder === order.id}
                                                        >
                                                            {savingOrder === order.id ? "…" : "Kaydet"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="adminOrderProducts">
                                            {order.products?.slice(0, 3).map((p, i) => (
                                                <div key={i} className="adminOrderChip">
                                                    <img src={p.image} alt={p.name} />
                                                    <span>{p.name}</span>
                                                    <span className="adminOrderQty">×{p.qty}</span>
                                                </div>
                                            ))}
                                            {(order.products?.length || 0) > 3 && (
                                                <span className="adminOrderMore">+{order.products.length - 3} daha</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* ── KULLANICILAR ── */}
                {activeTab === "users" && (
                    <div className="adminSection">
                        <h2 className="adminSectionTitle">Kullanıcılar</h2>
                        <span className="adminCount" style={{ marginBottom: 16, display: "block" }}>{users.length} kayıtlı kullanıcı</span>
                        <div className="adminTable">
                            <div className="adminTableHead" style={{ gridTemplateColumns: "1.5fr 2fr 1fr 1fr" }}>
                                <span>Kullanıcı</span><span>E-posta</span><span>Telefon</span><span>Son Güncelleme</span>
                            </div>
                            {users.map(u => (
                                <div className="adminTableRow" key={u.id} style={{ gridTemplateColumns: "1.5fr 2fr 1fr 1fr" }}>
                                    <div className="adminUserCell">
                                        <div className="adminUserAvatar">{(u.full_name || u.email || "?")[0].toUpperCase()}</div>
                                        <span>{u.full_name || "—"}</span>
                                    </div>
                                    <span className="adminTableCat">{u.email || "—"}</span>
                                    <span className="adminTableCat">{u.phone || "—"}</span>
                                    <span className="adminTableCat">
                                        {u.updated_at ? new Date(u.updated_at).toLocaleDateString("tr-TR") : "—"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── YORUMLAR ── */}
                {activeTab === "reviews" && (
                    <div className="adminSection">
                        <h2 className="adminSectionTitle">Yorum Moderasyonu</h2>
                        <div className="adminListHeader">
                            <div className="adminFilterPills">
                                <button className={`filterPill${reviewFilter === "all" ? " filterPill--active" : ""}`} onClick={() => setReviewFilter("all")}>Tümü</button>
                                <button className={`filterPill${reviewFilter === "2" ? " filterPill--active" : ""}`} onClick={() => setReviewFilter("2")}>2 Yıldız altı</button>
                                <button className={`filterPill${reviewFilter === "3" ? " filterPill--active" : ""}`} onClick={() => setReviewFilter("3")}>3 Yıldız altı</button>
                            </div>
                            <span className="adminCount">{filteredReviews.length} yorum</span>
                        </div>
                        <div className="adminReviewList">
                            {filteredReviews.map(r => (
                                <div className="adminReviewCard" key={r.id}>
                                    <div className="adminReviewTop">
                                        <div>
                                            <span className="adminReviewUser">{r.user_email}</span>
                                            <span className="adminReviewDate">{new Date(r.created_at).toLocaleDateString("tr-TR")}</span>
                                        </div>
                                        <div className="adminReviewStars">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <span key={i} style={{ color: i < r.rating ? "#ffd700" : "#333" }}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="adminReviewComment">{r.comment}</p>
                                    <div className="adminReviewFooter">
                                        <span className="adminReviewLikes">👍 {r.likes || 0}</span>
                                        <button className="adminSmallBtn adminSmallBtn--red" onClick={() => deleteReview(r.id)}>Sil</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>
        </div>
    )
}

export default Admin