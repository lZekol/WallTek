import "./ProductCard.css"
import { useNavigate } from "react-router-dom"
import { useRef } from "react"
import { flyToCart } from "../utils/flyToCart"

function ProductCard({ product, addToCart, toggleWishlist, wishlist }) {

    const navigate = useNavigate()
    const imgRef = useRef()

    const isFav = wishlist?.some(item => item.id === product.id)

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
        const rounded = Math.round(rating * 2) / 2

        for (let i = 1; i <= 5; i++) {

            if (i <= rounded) stars.push("⭐")
            else stars.push("☆")

        }

        return stars.join(" ")

    }

    return (

        <div className="productCard">

            {discount && (
                <div className="discountBadge">
                    %{discount}
                </div>
            )}

            <button
                className="wishlistBtn"
                onClick={(e) => {
                    e.stopPropagation()
                    toggleWishlist(product)
                }}
            >
                {isFav ? "❤️" : "🤍"}
            </button>

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

            <h3
                onClick={() => navigate(`/product/${product.id}`)}
            >
                {product.name}
            </h3>

            <div className="stars">

                {reviewCount > 0 ? (
                    <>
                        {renderStars()}

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