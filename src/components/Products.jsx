import "./Products.css"
import products from "../data/products"
import { Link } from "react-router-dom"

function Products({ addToCart, search = "" }) {

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    )
    return (

        <section id="products" className="products">

            <h2>Popüler Ürünler</h2>

            <div className="productsGrid">

                {filteredProducts
                    .filter(product => product.featured)
                    .map(product => (

                        <div className="productCard" key={product.id}>

                            {product.discount && (
                                <div className="discountBadge">
                                    %{Math.round((1 - product.price / product.oldPrice) * 100)}
                                </div>
                            )}

                            <div className="productImage">

                                <Link to={`/product/${product.id}`}>
                                    <img src={product.image} alt={product.name} />
                                </Link>

                            </div>

                            <h3>{product.name}</h3>

                            <div className="stars">
                                ⭐ ⭐ ⭐ ⭐ ⭐
                            </div>

                            <div className="price">
                                {product.price.toLocaleString("tr-TR")} TL
                            </div>

                            <button
                                className="addCartBtn"
                                onClick={() => addToCart(product)}
                            >
                                Sepete Ekle
                            </button>

                        </div>

                    ))}

            </div>

        </section>

    )

}

export default Products