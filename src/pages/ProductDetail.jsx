import { useParams } from "react-router-dom"
import products from "../data/products"
import "./ProductDetail.css"

function ProductDetail({ addToCart }) {

    const { id } = useParams()

    const product = products.find(p => p.id === Number(id))

    if (!product) {
        return <h2>Ürün bulunamadı</h2>
    }

    return (

        <section className="productDetail">

            <div className="detailContainer">

                <div className="detailImage">

                    <img src={product.image} alt={product.name} />

                </div>

                <div className="detailInfo">

                    <h1>{product.name}</h1>

                    <div className="stars">
                        ⭐ ⭐ ⭐ ⭐ ⭐
                    </div>

                    <div className="price">
                        {product.price.toLocaleString()} ₺
                    </div>

                    <p className="desc">
                        Yüksek performanslı teknoloji ürünü. Oyun, iş ve günlük kullanım için ideal.
                    </p>

                    <ul className="features">

                        <li>⚡ Yüksek performans</li>
                        <li>🔥 Gaming uyumlu</li>
                        <li>💻 Modern tasarım</li>
                        <li>🚀 Hızlı işlemci</li>

                    </ul>

                    <button
                        className="addCartBtn"
                        onClick={() => addToCart(product)}
                    >
                        Sepete Ekle
                    </button>

                </div>

            </div>

        </section>

    )

}

export default ProductDetail