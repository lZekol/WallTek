import { useParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import "./CategoryPage.css"
import SkeletonCard from "../components/SkeletonCard"

/* ── sort options ── */
const SORT_OPTIONS = [
    { value: "default", label: "Varsayılan" },
    { value: "priceLow", label: "Ucuzdan Pahalıya" },
    { value: "priceHigh", label: "Pahalıdan Ucuza" },
    { value: "newest", label: "En Yeni" },
]

/* ── rating chip options ── */
const RATING_OPTIONS = [
    { value: "all", label: "Tümü", stars: 0 },
    { value: "4", label: "4★ ve üzeri", stars: 4 },
    { value: "3", label: "3★ ve üzeri", stars: 3 },
    { value: "2", label: "2★ ve üzeri", stars: 2 },
]

function Stars({ count }) {
    return (
        <span className="ratingStars">
            {"★".repeat(count)}{"☆".repeat(5 - count)}
        </span>
    )
}

function CategoryPage({ addToCart, toggleWishlist, wishlist }) {

    const { categoryName } = useParams()

    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [priceRange, setPriceRange] = useState(100000)
    const [sortType, setSortType] = useState("default")
    const [ratingFilter, setRatingFilter] = useState("all")
    const [campaignOnly, setCampaignOnly] = useState(false)

    const MAX_PRICE = 100000

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)

            const { data: products } = await supabase
                .from("products")
                .select("*")

            const { data: reviews } = await supabase
                .from("reviews")
                .select("product_id,rating")

            const productsWithRating = products.map(product => {
                const productReviews = reviews.filter(
                    r => String(r.product_id) === String(product.id)
                )
                const reviewCount = productReviews.length
                const avgRating = reviewCount > 0
                    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
                    : 0
                return { ...product, rating: avgRating, reviewCount }
            })

            setAllProducts(productsWithRating)
            setLoading(false)
        }

        fetchProducts()
    }, [])

    /* ── filtering ── */
    let categoryProducts = allProducts
        .filter(p => p.category?.toLowerCase() === categoryName?.toLowerCase())
        .filter(p => p.price <= priceRange)

    if (campaignOnly) categoryProducts = categoryProducts.filter(p => p.old_price)
    if (ratingFilter !== "all") categoryProducts = categoryProducts.filter(p => Math.floor(p.rating) >= Number(ratingFilter))

    /* ── sorting ── */
    const sorted = [...categoryProducts]
    if (sortType === "priceLow") sorted.sort((a, b) => a.price - b.price)
    if (sortType === "priceHigh") sorted.sort((a, b) => b.price - a.price)
    if (sortType === "newest") sorted.sort((a, b) => b.id - a.id)

    /* ── dynamic slider fill % ── */
    const sliderFill = `${(priceRange / MAX_PRICE) * 100}%`

    /* ── reset all filters ── */
    const resetFilters = () => {
        setPriceRange(MAX_PRICE)
        setRatingFilter("all")
        setCampaignOnly(false)
        setSortType("default")
    }

    return (
        <div className="categoryPage">

            {/* hero heading */}
            <div className="categoryHero">
                <h1 className="categoryTitle">{categoryName?.toUpperCase()}</h1>
                <p className="productCount">
                    {loading ? "Yükleniyor…" : `${sorted.length} ürün bulundu`}
                </p>
            </div>

            <div className="categoryLayout">

                {/* ── SIDEBAR ── */}
                <div className="sidebarWrapper">
                    <div className="filterSidebar">

                        {/* price range */}
                        <div className="priceFilter">
                            <p className="filterLabel">Fiyat Aralığı</p>
                            <div className="priceValues">
                                <span>0 TL</span>
                                <strong>{Number(priceRange).toLocaleString("tr-TR")} TL</strong>
                            </div>
                            <input
                                type="range"
                                className="priceSlider"
                                style={{ "--fill": sliderFill }}
                                min="0"
                                max={MAX_PRICE}
                                step="1000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                            />
                        </div>

                        <div className="filterDivider" />

                        {/* rating chips */}
                        <div className="ratingFilter">
                            <p className="filterLabel">Minimum Puan</p>
                            <div className="ratingChips">
                                {RATING_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        className={`ratingChip${ratingFilter === opt.value ? " active" : ""}`}
                                        onClick={() => setRatingFilter(opt.value)}
                                    >
                                        {opt.stars > 0 && <Stars count={opt.stars} />}
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filterDivider" />

                        {/* campaign toggle */}
                        <div className="campaignFilter">
                            <label className="campaignToggle">
                                <input
                                    type="checkbox"
                                    checked={campaignOnly}
                                    onChange={(e) => setCampaignOnly(e.target.checked)}
                                />
                                <div className="toggleTrack">
                                    <div className="toggleThumb" />
                                </div>
                                Sadece indirimli ürünler
                            </label>
                        </div>

                        <div className="filterDivider" />

                        {/* reset */}
                        <button className="resetFilters" onClick={resetFilters}>
                            Filtreleri Sıfırla
                        </button>

                    </div>
                </div>

                {/* ── PRODUCTS ── */}
                <div className="categoryProducts">

                    {/* sort bar */}
                    <div className="sortBar">
                        <span className="sortBarLeft">
                            {!loading && <><span>{sorted.length}</span> ürün listeleniyor</>}
                        </span>
                        <div className="sortControls">
                            <span className="sortLabel">Sırala:</span>
                            <div className="sortPills">
                                {SORT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        className={`sortPill${sortType === opt.value ? " activePill" : ""}`}
                                        onClick={() => setSortType(opt.value)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* grid */}
                    <div className="productsGrid">
                        {loading
                            ? Array(9).fill(null).map((_, i) => <SkeletonCard key={i} />)
                            : sorted.length === 0
                                ? (
                                    <div className="emptyState">
                                        <p>Bu kriterlere uyan ürün bulunamadı.</p>
                                        <button
                                            className="resetFilters"
                                            style={{ marginTop: 16, display: "inline-block" }}
                                            onClick={resetFilters}
                                        >
                                            Filtreleri temizle
                                        </button>
                                    </div>
                                )
                                : sorted.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        addToCart={addToCart}
                                        toggleWishlist={toggleWishlist}
                                        wishlist={wishlist}
                                    />
                                ))
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CategoryPage