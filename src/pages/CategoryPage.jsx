import { useParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import "./CategoryPage.css"

function CategoryPage({ addToCart, toggleWishlist, wishlist }) {

    const { categoryName } = useParams()

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


    const categoryProducts = allProducts.filter(product =>
        product.category?.toLowerCase() === categoryName?.toLowerCase()
    )


    return (

        <div className="categoryPage">

            <h1>{categoryName.toUpperCase()}</h1>

            <div className="productsGrid">

                {categoryProducts.map(product => (

                    <ProductCard
                        key={product.id}
                        product={product}
                        addToCart={addToCart}
                        toggleWishlist={toggleWishlist}
                        wishlist={wishlist}
                    />

                ))}

            </div>

        </div>

    )

}

export default CategoryPage