import { useParams } from "react-router-dom"
import products from "../data/products"
import "./ProductDetail.css"

function ProductDetail({ addToCart }) {

    const { id } = useParams()

    const extraProducts =
        JSON.parse(localStorage.getItem("extraProducts")) || []

    const allProducts = [...products, ...extraProducts]

    const product = allProducts.find(
        p => String(p.id) === String(id)
    )

    if (!product) {

        return (
            <div style={{
                marginTop: "120px",
                color: "white",
                textAlign: "center"
            }}>
                Ürün bulunamadı
            </div>
        )

    }

    const similarProducts = allProducts.filter(
        p => p.category === product.category && p.id !== product.id
    )

    let viewed = JSON.parse(localStorage.getItem("recent")) || []

    viewed = viewed.filter(p => p.id !== product.id)

    viewed.unshift(product)

    localStorage.setItem("recent", JSON.stringify(viewed.slice(0, 4)))

    const recent = JSON.parse(localStorage.getItem("recent")) || []


    return (

        <div className="productPage">

            <div className="productDetail">

                <div className="productImage">

                    <img
                        src={product.image}
                        alt={product.name}
                        className="zoomImg"
                    />

                </div>

                <div className="productInfo">

                    <h1>{product.name}</h1>

                    <div className="stars">⭐⭐⭐⭐⭐</div>

                    <div className="price">
                        {product.price.toLocaleString("tr-TR")} TL
                    </div>

                    <p>
                        Yüksek performanslı teknoloji ürünü. Oyun, iş ve günlük kullanım için ideal.
                    </p>

                    <ul className="features">
                        <li>⚡ Yüksek performans</li>
                        <li>🔥 Gaming uyumlu</li>
                        <li>💻 Modern tasarım</li>
                        <li>🚀 Hızlı işlemci</li>
                    </ul>

                    <button onClick={() => addToCart(product)}>
                        Sepete Ekle
                    </button>

                </div>

            </div>


            <h2 className="similarTitle">Benzer Ürünler</h2>

            <div className="similarGrid">

                {similarProducts.slice(0, 4).map(item => (

                    <div className="similarCard" key={item.id}>

                        <img src={item.image} alt={item.name} />

                        <h3>{item.name}</h3>

                        <div className="price">
                            {item.price.toLocaleString("tr-TR")} TL
                        </div>

                        <button onClick={() => addToCart(item)}>
                            Sepete Ekle
                        </button>

                    </div>

                ))}

            </div>


            <h2 className="similarTitle">Son Görüntülenenler</h2>

            <div className="similarGrid">

                {recent.map(item => (

                    <div className="similarCard" key={item.id}>

                        <img src={item.image} alt={item.name} />

                        <h3>{item.name}</h3>

                        <div className="price">
                            {item.price.toLocaleString("tr-TR")} TL
                        </div>

                        <button onClick={() => addToCart(item)}>
                            Sepete Ekle
                        </button>

                    </div>

                ))}

            </div>

        </div>

    )

}

export default ProductDetail