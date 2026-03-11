import { useParams } from "react-router-dom"
import products from "../data/products"
import ProductCard from "../components/ProductCard"
import { useEffect, useState } from "react"
import "./CategoryPage.css"

function CategoryPage({ addToCart, toggleWishlist, wishlist }) {

    const { categoryName } = useParams()

    const [allProducts, setAllProducts] = useState([])

    useEffect(() => {

        const extraProducts =
            JSON.parse(localStorage.getItem("extraProducts")) || []

        setAllProducts([...products, ...extraProducts])

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