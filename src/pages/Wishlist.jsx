import "./Wishlist.css"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import ProductCard from "../components/ProductCard"
import { useNavigate } from "react-router-dom"

function Wishlist({ addToCart, toggleWishlist, wishlist, user }) {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true)
            if (!wishlist || wishlist.length === 0) {
                setProducts([])
                setLoading(false)
                return
            }
            const ids = wishlist.map(w => w.product_id)
            const { data } = await supabase
                .from("products")
                .select("*")
                .in("id", ids)
            setProducts(data || [])
            setLoading(false)
        }
        getProducts()
    }, [wishlist])

    return (
        <section className="wishlistPage">

            <div className="wishlistHeader">
                <h2>Favorilerim</h2>
                <span className="wishlistCount">{products.length} ürün</span>
            </div>

            {loading ? (
                <div className="wishlistGrid">
                    {Array(4).fill(null).map((_, i) => (
                        <div key={i} className="wishlistSkeleton" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="emptyWishlist">
                    <span className="emptyHeart">💔</span>
                    <h3>Favori ürününüz yok</h3>
                    <p>Beğendiğin ürünleri favorilere ekleyerek buradan takip edebilirsin.</p>
                    <button className="goShopBtn" onClick={() => navigate("/")}>
                        Alışverişe Başla
                    </button>
                </div>
            ) : (
                <div className="wishlistGrid">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            addToCart={addToCart}
                            toggleWishlist={toggleWishlist}
                            wishlist={wishlist}
                            user={user}   /* ✅ eklendi */
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

export default Wishlist