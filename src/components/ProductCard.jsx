import "./ProductCard.css"
import { useNavigate } from "react-router-dom"
import { useRef } from "react"
import { flyToCart } from "../utils/flyToCart"
import { FaHeart } from "react-icons/fa"

function ProductCard({ product, addToCart, toggleWishlist, wishlist }) {

    const navigate = useNavigate()
    const imgRef = useRef()

    const isFav = wishlist?.some(item => item.product_id === product.id)
    const rating = product.rating || 0
    const reviewCount = product.reviewCount || 0

    const discount = product.old_price
        ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
        : null

    const savings = product.old_price
        ? (product.old_price - product.price).toLocaleString("tr-TR")
        : null

    const handleAddCart = (e) => {
        e.stopPropagation()
        const cartIcon = document.querySelector(".cart")
        flyToCart(imgRef.current, cartIcon)
        addToCart(product)
    }

    /* ✅ Kontrol tamamen toggleWishlist'te (App.jsx) — user kontrolü burada YOK */
    const handleWishlist = (e) => {
        e.stopPropagation()
        toggleWishlist(product, e)
    }

    const renderStars = () => {
        const rounded = Math.round(rating)
        return Array.from({ length: 5 }, (_, i) => i < rounded ? "★" : "☆").join("")
    }

    const renderBadge = () => {
        if (product.is_bestseller || product.featured)
            return <span className="cardBadge bestseller">EN ÇOK SATAN</span>
        if (product.is_new)
            return <span className="cardBadge new">YENİ</span>
        if (product.fast_delivery)
            return <span className="cardBadge fast">HIZLI TESLİMAT</span>
        return null
    }

    return (
        <div className={`productCard${discount ? " hasDiscount" : ""}`}>

            {discount && <div className="discountBadge">%{discount}</div>}

            <button
                className={`wishlistBtn${isFav ? " active" : ""}`}
                onClick={handleWishlist}
                title={isFav ? "Favorilerden çıkar" : "Favorilere ekle"}
            >
                <FaHeart />
            </button>

            <div className="imageWrapper" onClick={() => navigate(`/product/${product.id}`)}>
                <img ref={imgRef} src={product.image} alt={product.name} loading="lazy" />
            </div>

            <div className="cardInfo" onClick={() => navigate(`/product/${product.id}`)}>
                <div className="cardBadgeRow">{renderBadge()}</div>

                <h3>{product.name}</h3>

                <div className="stars">
                    {reviewCount > 0 ? (
                        <>
                            <span className="starText">{renderStars()}</span>
                            <span className="ratingNumber">{rating.toFixed(1)}</span>
                            <span className="reviewCount">({reviewCount})</span>
                        </>
                    ) : (
                        <span className="noReview">Henüz yorum yok</span>
                    )}
                </div>

                <div className="priceBox">
                    {product.old_price && (
                        <span className="oldPrice">{product.old_price.toLocaleString("tr-TR")} TL</span>
                    )}
                    <span className="newPrice">{product.price.toLocaleString("tr-TR")} TL</span>
                    {savings && <span className="priceSaving">{savings} TL indirim</span>}
                </div>
            </div>

            <button className="addCartBtn" onClick={handleAddCart}>Sepete Ekle</button>
        </div>
    )
}

export default ProductCard