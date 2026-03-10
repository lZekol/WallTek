import "./Products.css"
import products from "../data/products"
import ProductCard from "./ProductCard"

function Products({ addToCart, search = "", toggleWishlist, wishlist = [] }) {

    /* SEARCH varsa tüm ürünlerde ara */

    const searchResults = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    )

    /* SEARCH yoksa sadece popüler (featured) ürünler */

    const displayProducts = search
        ? searchResults
        : products.filter(product => product.featured).slice(0, 8)

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