import "./ProductCard.css"
import { useNavigate } from "react-router-dom"
import { useRef } from "react"
import { flyToCart } from "../utils/flyToCart"

function ProductCard({ product, addToCart, toggleWishlist, wishlist }) {

    const navigate = useNavigate()

    const imgRef = useRef()

    const isFav = wishlist?.some(item => item.id === product.id)

    const handleAddCart = (e) => {

        e.stopPropagation()

        const cartIcon = document.querySelector(".cart")

        flyToCart(imgRef.current, cartIcon)

        addToCart(product)

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
                onClick={() => navigate(`/product/${product.id}`)}
            />


            {/* İSİM */}

            <h3
                onClick={() => navigate(`/product/${product.id}`)}
            >
                {product.name}
            </h3>


            <div className="stars">
                ⭐ ⭐ ⭐ ⭐ ⭐
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