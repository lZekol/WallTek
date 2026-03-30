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

    const handleAddCart = (e) => {
        e.stopPropagation()
        const cartIcon = document.querySelector(".cart")
        flyToCart(imgRef.current, cartIcon)
        addToCart(product)
    }

    const renderStars = () => {
        const stars = []
        const rounded = Math.round(rating)

        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rounded ? "★" : "☆")
        }

        return stars.join("")
    }

    return (

        <div className="productCard">

            {/* DISCOUNT */}
            {discount && (
                <div className="discountBadge">
                    %{discount}
                </div>
            )}

            {/* WISHLIST */}
            <button
                className={`wishlistBtn ${isFav ? "active" : ""}`}
                onClick={(e) => toggleWishlist(product, e)}
            >
                <FaHeart />
            </button>

            {/* IMAGE */}
            <div
                className="imageWrapper"
                onClick={() => navigate(`/product/${product.id}`)}
            >
                <img
                    ref={imgRef}
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                />
            </div>

            {/* TITLE */}
            <h3 onClick={() => navigate(`/product/${product.id}`)}>
                {product.name}
            </h3>

            {/* RATING */}
            <div className="stars">

                {reviewCount > 0 ? (
                    <>
                        <span className="starText">{renderStars()}</span>

                        <span className="ratingNumber">
                            {rating.toFixed(1)}
                        </span>

                        <span className="reviewCount">
                            ({reviewCount})
                        </span>
                    </>
                ) : (
                    <span className="noReview">
                        Henüz yorum yok
                    </span>
                )}

            </div>

            {/* PRICE */}
            <div className="priceBox">

                {product.old_price && (
                    <span className="oldPrice">
                        {product.old_price.toLocaleString("tr-TR")} TL
                    </span>
                )}

                <span className="newPrice">
                    {product.price.toLocaleString("tr-TR")} TL
                </span>

            </div>

            {/* BUTTON */}
            <button
                className="addCartBtn"
                onClick={handleAddCart}
            >
                Sepete Ekle
            </button>

        </div>

    )

}

export default ProductCard