import "./ProductCard.css"
import { useNavigate } from "react-router-dom"
import { useRef } from "react"
import { flyToCart } from "../utils/flyToCart"
import { showToast } from "../utils/toast"
import { FaHeart } from "react-icons/fa"

function ProductCard({ product, addToCart, toggleWishlist, wishlist, user }) {

    const navigate = useNavigate()
    const imgRef = useRef()

    const isFav = wishlist?.some(item => item.product_id === product.id)
    const rating = product.rating || 0
    const reviewCount = product.reviewCount || 0

    const discount = product.old_price
        ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
        : null

    const handleAddCart = (e) => {
        e.stopPropagation()
        const cartIcon = document.querySelector(".cart")
        flyToCart(imgRef.current, cartIcon)
        addToCart(product)
    }

    /* giriş yoksa alert yerine toast */
    const handleWishlist = (e) => {
        e.stopPropagation()
        if (!user) {
            showToast("Favorilere eklemek için giriş yapmalısın", "info")
            return
        }
        toggleWishlist(product, e)
    }

    const renderStars = () => {
        const rounded = Math.round(rating)
        return Array.from({ length: 5 }, (_, i) => i < rounded ? "★" : "☆").join("")
    }

    return (
        <div className="productCard">

            {discount && <div className="discountBadge">%{discount}</div>}

            <button
                className={`wishlistBtn ${isFav ? "active" : ""}`}
                onClick={handleWishlist}
                title={isFav ? "Favorilerden çıkar" : "Favorilere ekle"}
            >
                <FaHeart />
            </button>

            <div className="imageWrapper" onClick={() => navigate(`/product/${product.id}`)}>
                <img ref={imgRef} src={product.image} alt={product.name} loading="lazy" />
            </div>

            <h3 onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>

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
            </div>

            <button className="addCartBtn" onClick={handleAddCart}>Sepete Ekle</button>

        </div>
    )
}

export default ProductCard