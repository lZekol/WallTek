import "./Products.css"
import ProductCard from "./ProductCard"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

function Products({ addToCart, search = "", toggleWishlist, wishlist = [] }) {

    const [allProducts, setAllProducts] = useState([])

    useEffect(() => {

        const fetchProducts = async () => {

            const { data, error } = await supabase
                .from("products")
                .select("*")

            if (!error) {

                setAllProducts(data)

            }

        }

        fetchProducts()

    }, [])


    const searchResults = allProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    )


    const displayProducts = search
        ? searchResults
        : allProducts.filter(product => product.featured).slice(0, 8)


    return (

        <section id="products" className="products">

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