import "./Products.css"
import ProductCard from "./ProductCard"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

function Products({ addToCart, search = "", toggleWishlist, wishlist = [], user }) {

    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchProducts = async () => {
        setLoading(true)

        const { data: products, error } = await supabase
            .from("products")
            .select("*")
            .order("id", { ascending: false })

        if (error) { console.log("PRODUCT ERROR:", error); setLoading(false); return }

        const { data: reviews } = await supabase
            .from("reviews")
            .select("product_id, rating")

        const safeReviews = reviews || []

        const productsWithRating = (products || []).map(product => {
            const productReviews = safeReviews.filter(
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

    useEffect(() => { fetchProducts() }, [])

    useEffect(() => {
        const handleFocus = () => fetchProducts()
        window.addEventListener("focus", handleFocus)
        return () => window.removeEventListener("focus", handleFocus)
    }, [])

    const searchResults = allProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )
    const featuredProducts = allProducts.filter(
        p => p.featured === true || p.featured === "true"
    )
    const displayProducts = search ? searchResults : featuredProducts.slice(0, 24)

    return (
        <section id="products" className="products highlightTarget">
            <h2>{search ? "Arama Sonuçları" : "Popüler Ürünler"}</h2>

            <div className="productsGrid">
                {loading ? (
                    <p style={{ opacity: 0.6 }}>Yükleniyor...</p>
                ) : displayProducts.length === 0 ? (
                    <p>Ürün bulunamadı</p>
                ) : (
                    displayProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            addToCart={addToCart}
                            toggleWishlist={toggleWishlist}
                            wishlist={wishlist}
                            user={user}   /* ✅ EKLENDİ */
                        />
                    ))
                )}
            </div>
        </section>
    )
}

export default Products