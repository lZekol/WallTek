import { useParams, Link } from "react-router-dom"
import products from "../data/products"
import "./CategoryPage.css"

function CategoryPage({ addToCart }) {

    const { categoryName } = useParams()

    const filteredProducts = products.filter(
        (product) => product.category.toLowerCase() === categoryName.toLowerCase()
    )

    return (

        <section className="categoryPage">

            <h2 className="categoryTitle">
                {categoryName.toUpperCase()}
            </h2>

            {filteredProducts.length === 0 ? (

                <p style={{ textAlign: "center", marginTop: "40px" }}>
                    Bu kategoride ürün bulunamadı
                </p>

            ) : (

                <div className="productsGrid">

                    {filteredProducts.map((product) => (

                        <div className="productCard" key={product.id}>

                            <Link to={`/product/${product.id}`}>

                                <div className="productImage">
                                    <img src={product.image} alt={product.name} />
                                </div>

                                <h3>{product.name}</h3>

                            </Link>

                            <div className="price">
                                {product.price.toLocaleString()} ₺
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

            )}

        </section>

    )

}

export default CategoryPage