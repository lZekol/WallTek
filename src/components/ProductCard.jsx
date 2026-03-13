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

            {/* FAVORİ */}

            <button
                className="wishlistBtn"
                onClick={(e) => {
                    e.stopPropagation()
                    toggleWishlist(product)
                }}
            >
                {isFav ? "❤️" : "🤍"}
            </button>


            {/* ÜRÜN RESMİ */}

            <img
                ref={imgRef}
                src={product.image}
                alt={product.name}
                loading="lazy"
                onClick={() => navigate(`/product/${product.id}`)}
            />


            {/* İSİM */}

            <h3
                onClick={() => navigate(`/product/${product.id}`)}
            >
                {product.name}
            </h3>


            {/* RATING */}

            <div className="stars">

                {renderStars()}

                <span className="ratingNumber">
                    {rating.toFixed(1)}
                </span>

                <span className="reviewCount">
                    ({reviewCount})
                </span>

            </div>


            <p className="price">
                {product.price.toLocaleString("tr-TR")} TL
            </p>


            {/* SEPET */}

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