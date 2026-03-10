import "./ProductCard.css"
import { useNavigate } from "react-router-dom"

function ProductCard({ product, addToCart, toggleWishlist, wishlist }) {

    const navigate = useNavigate()

    const isFav = wishlist?.some(item => item.id === product.id)

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
                onClick={(e) => {
                    e.stopPropagation()
                    addToCart(product)
                }}
            >

                Sepete Ekle

            </button>

        </div>

    )

}

export default ProductCard