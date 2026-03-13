import "./Products.css"
import ProductCard from "./ProductCard"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

function Products({ addToCart, search = "", toggleWishlist, wishlist = [] }) {

    const [allProducts, setAllProducts] = useState([])

    const fetchProducts = async () => {

        const { data: products, error } = await supabase
            .from("products")
            .select("*")

        if (error) return


        const { data: reviews } = await supabase
            .from("reviews")
            .select("product_id, rating")


        const productsWithRating = products.map(product => {

            const productReviews = reviews.filter(
                r => String(r.product_id) === String(product.id)
            )

            const reviewCount = productReviews.length

            const avgRating =
                reviewCount > 0
                    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
                    : 0

            return {
                ...product,
                rating: avgRating,
                reviewCount
            }

        })

        setAllProducts(productsWithRating)

    }


    useEffect(() => {
        fetchProducts()
    }, [])


    // sayfaya geri gelince tekrar fetch
    useEffect(() => {

        const handleFocus = () => {
            fetchProducts()
        }

        window.addEventListener("focus", handleFocus)

        return () => window.removeEventListener("focus", handleFocus)

    }, [])


    const searchResults = allProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    )


    const displayProducts = search
        ? searchResults
        : allProducts.filter(product => product.featured).slice(0, 8)


    return (

        <section id="products" className="products highlightTarget">

            <h2>{search ? "Arama Sonuçları" : "Popüler Ürünler"}</h2>

            <div className="productsGrid">

                {displayProducts.map(product => (

                    <ProductCard
                        key={product.id}
                        product={product}
                        addToCart={addToCart}
                        toggleWishlist={toggleWishlist}
                        wishlist={wishlist}
                    />

                ))}

            </div>

        </section>

    )

}

export default Products