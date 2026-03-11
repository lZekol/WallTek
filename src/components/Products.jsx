import "./Products.css"
import products from "../data/products"
import ProductCard from "./ProductCard"
import { useEffect, useState } from "react"

function Products({ addToCart, search = "", toggleWishlist, wishlist = [] }) {

    const [allProducts, setAllProducts] = useState([])

    const loadProducts = () => {

        const extraProducts =
            JSON.parse(localStorage.getItem("extraProducts")) || []

        setAllProducts([...products, ...extraProducts])

    }

    useEffect(() => {

        loadProducts()

        window.addEventListener("storage", loadProducts)

        return () => {
            window.removeEventListener("storage", loadProducts)
        }

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