import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import ProductCard from "../components/ProductCard"
import { FaHeart, FaShoppingCart, FaCheck, FaTruck, FaUndo } from "react-icons/fa"
import "./ProductDetail.css"

function ProductDetail({ addToCart, toggleWishlist, wishlist, user }) {

    const { id } = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [allProducts, setAllProducts] = useState([])
    const [reviews, setReviews] = useState([])
    const [recent, setRecent] = useState([])
    const [newComment, setNewComment] = useState("")
    const [rating, setRating] = useState(5)
    const [profileName, setProfileName] = useState("")
    const [sort, setSort] = useState("new")
    const [showSticky, setShowSticky] = useState(false)
    const [addedToCart, setAddedToCart] = useState(false)

    const isFav = wishlist?.some(w => w.product_id === product?.id)

    /* ── fetch products ── */
    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase.from("products").select("*")
            if (data) {
                setAllProducts(data)
                setProduct(data.find(p => String(p.id) === String(id)))
            }
        }
        fetchProducts()
    }, [id])

    /* ── user + profile ── */
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser()
            if (data.user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", data.user.id)
                    .single()
                setProfileName(profile?.full_name || data.user.user_metadata?.full_name || data.user.email)
            }
        }
        getUser()
    }, [])

    /* ── fetch reviews ── */
    const fetchReviews = async (productId) => {
        let query = supabase.from("reviews").select("*").eq("product_id", productId)
        if (sort === "new") query = query.order("created_at", { ascending: false })
        if (sort === "high") query = query.order("rating", { ascending: false })
        if (sort === "low") query = query.order("rating", { ascending: true })
        const { data } = await query
        if (data) setReviews(data)
    }

    useEffect(() => { if (product) fetchReviews(product.id) }, [product, sort])

    /* ── average rating ── */
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0

    const renderStars = (count) =>
        Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ color: i < Math.round(count) ? "#ffd700" : "#444", fontSize: 16 }}>★</span>
        ))

    /* ── add review ── */
    const addReview = async () => {
        if (!newComment.trim()) return
        await supabase.from("reviews").insert([{
            product_id: Number(product.id),
            user_email: profileName || user?.email || "Anonim",
            rating: Number(rating),
            comment: newComment
        }])
        setNewComment("")
        setRating(5)
        fetchReviews(product.id)
    }

    /* ── like review ── */
    const likeReview = async (reviewId, currentLikes) => {
        await supabase.from("reviews").update({ likes: currentLikes + 1 }).eq("id", reviewId)
        fetchReviews(product.id)
    }

    /* ── recent products ── */
    useEffect(() => {
        if (!product) return
        let viewed = JSON.parse(localStorage.getItem("recent")) || []
        viewed = viewed.filter(p => p.id !== product.id)
        viewed.unshift(product)
        viewed = viewed.slice(0, 4)
        localStorage.setItem("recent", JSON.stringify(viewed))
        setRecent(viewed)
    }, [product])

    /* ── sticky cart ── */
    useEffect(() => {
        const handleScroll = () => setShowSticky(window.scrollY > 400)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    /* ── add to cart with feedback ── */
    const handleAddToCart = () => {
        addToCart(product)
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 1800)
    }

    /* ── wishlist ── */
    const handleWishlist = (e) => {
        e.stopPropagation()
        toggleWishlist(product, e)
    }

    const formatDate = (date) => {
        const diff = Math.floor((new Date() - new Date(date)) / 1000)
        if (diff < 60) return "az önce"
        if (diff < 3600) return Math.floor(diff / 60) + " dk önce"
        if (diff < 86400) return Math.floor(diff / 3600) + " saat önce"
        return Math.floor(diff / 86400) + " gün önce"
    }

    const discount = product?.old_price
        ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
        : null

    if (!product) return <div className="pdNotFound">Ürün yükleniyor…</div>

    const similarProducts = allProducts.filter(
        p => p.category === product.category && p.id !== product.id
    ).slice(0, 4)

    return (
        <div className="productPage">

            {/* ── MAIN DETAIL ── */}
            <div className="productDetail">

                {/* image */}
                <div className="productImageBox">
                    {discount && <div className="pdDiscountBadge">%{discount}</div>}
                    <div className="productImageInner">
                        <img src={product.image} alt={product.name} className="pdImg" />
                    </div>
                </div>

                {/* info */}
                <div className="productInfo">

                    <div className="pdCategory">{product.category?.toUpperCase()}</div>
                    <h1>{product.name}</h1>

                    {/* rating summary */}
                    <div className="pdRatingRow">
                        <div className="pdStars">{renderStars(averageRating)}</div>
                        <span className="pdRatingText">
                            {averageRating} • {reviews.length} yorum
                        </span>
                    </div>

                    {/* price */}
                    <div className="pdPriceBox">
                        {product.old_price && (
                            <span className="pdOldPrice">
                                {product.old_price.toLocaleString("tr-TR")} TL
                            </span>
                        )}
                        <span className="pdNewPrice">
                            {product.price.toLocaleString("tr-TR")} TL
                        </span>
                        {discount && (
                            <span className="pdSaving">%{discount} indirim</span>
                        )}
                    </div>

                    {/* meta badges */}
                    <div className="pdMeta">
                        <span className="pdMetaBadge"><FaCheck size={11} /> Stokta</span>
                        <span className="pdMetaBadge"><FaTruck size={11} /> Ücretsiz Kargo</span>
                        <span className="pdMetaBadge"><FaUndo size={11} /> 14 Gün İade</span>
                    </div>

                    {/* description */}
                    {product.description && (
                        <div className="pdDescBox">
                            <h3>Ürün Açıklaması</h3>
                            <p>{product.description}</p>
                        </div>
                    )}

                    {/* action buttons */}
                    <div className="pdActions">
                        <button
                            className={`pdCartBtn${addedToCart ? " added" : ""}`}
                            onClick={handleAddToCart}
                        >
                            <FaShoppingCart size={15} />
                            {addedToCart ? "Eklendi ✓" : "Sepete Ekle"}
                        </button>

                        <button
                            className={`pdWishBtn${isFav ? " active" : ""}`}
                            onClick={handleWishlist}
                            title={isFav ? "Favorilerden çıkar" : "Favorilere ekle"}
                        >
                            <FaHeart size={16} />
                        </button>
                    </div>

                </div>
            </div>

            {/* ── SIMILAR PRODUCTS ── */}
            {similarProducts.length > 0 && (
                <div className="pdSection">
                    <h2 className="pdSectionTitle">Benzer Ürünler</h2>
                    <div className="pdSimilarGrid">
                        {similarProducts.map(item => (
                            <ProductCard
                                key={item.id}
                                product={item}
                                addToCart={addToCart}
                                toggleWishlist={toggleWishlist}
                                wishlist={wishlist}
                                user={user}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ── REVIEWS ── */}
            <div className="pdSection">
                <h2 className="pdSectionTitle">Yorumlar</h2>

                <div className="pdReviewLayout">

                    {/* yorum formu */}
                    <div className="pdReviewForm">
                        <h3>Yorum Yaz</h3>

                        {/* star selector */}
                        <div className="pdStarSelect">
                            {[1, 2, 3, 4, 5].map(n => (
                                <span
                                    key={n}
                                    onClick={() => setRating(n)}
                                    style={{
                                        cursor: "pointer",
                                        fontSize: 26,
                                        color: n <= rating ? "#ffd700" : "#333",
                                        transition: "color 0.15s"
                                    }}
                                >★</span>
                            ))}
                        </div>

                        <textarea
                            placeholder="Ürün hakkında düşüncelerinizi paylaşın…"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={4}
                        />

                        <button onClick={addReview} className="pdSubmitBtn">
                            Yorum Gönder
                        </button>
                    </div>

                    {/* yorum listesi */}
                    <div className="pdReviewList">
                        <div className="pdReviewSortBar">
                            <span>{reviews.length} yorum</span>
                            <select value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option value="new">En Yeni</option>
                                <option value="high">En Yüksek Puan</option>
                                <option value="low">En Düşük Puan</option>
                            </select>
                        </div>

                        {reviews.length === 0 ? (
                            <div className="pdNoReview">Henüz yorum yok. İlk yorumu sen yaz!</div>
                        ) : (
                            reviews.map(r => (
                                <div className="pdReviewItem" key={r.id}>
                                    <div className="pdReviewTop">
                                        <div>
                                            <span className="pdReviewUser">{r.user_email}</span>
                                            <span className="pdReviewDate">{formatDate(r.created_at)}</span>
                                        </div>
                                        <div className="pdReviewStars">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <span key={i} style={{ color: i < r.rating ? "#ffd700" : "#333" }}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="pdReviewComment">{r.comment}</p>
                                    <button
                                        className="pdLikeBtn"
                                        onClick={() => likeReview(r.id, r.likes || 0)}
                                    >
                                        👍 {r.likes || 0} Faydalı
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ── RECENTLY VIEWED ── */}
            {recent.length > 1 && (
                <div className="pdSection">
                    <h2 className="pdSectionTitle">Son Görüntülenenler</h2>
                    <div className="pdSimilarGrid">
                        {recent.filter(r => r.id !== product.id).map(item => (
                            <ProductCard
                                key={item.id}
                                product={item}
                                addToCart={addToCart}
                                toggleWishlist={toggleWishlist}
                                wishlist={wishlist}
                                user={user}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ── STICKY CART BAR ── */}
            {showSticky && (
                <div className="pdStickyBar">
                    <div className="pdStickyInner">
                        <div className="pdStickyLeft">
                            <img src={product.image} alt="" />
                            <span>{product.name}</span>
                        </div>
                        <div className="pdStickyRight">
                            <span className="pdStickyPrice">{product.price.toLocaleString("tr-TR")} TL</span>
                            <button onClick={handleAddToCart}>Sepete Ekle</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default ProductDetail