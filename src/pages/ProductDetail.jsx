import { useParams } from "react-router-dom"
import products from "../data/products"
import "./ProductDetail.css"
import { useEffect } from "react"

function ProductDetail({ addToCart }) {

    const { id } = useParams()

    const product = products.find(p => p.id === Number(id))

    /* RECENTLY VIEWED */

    useEffect(() => {

        let viewed = JSON.parse(localStorage.getItem("recent")) || []

        viewed = viewed.filter(p => p.id !== product.id)

        viewed.unshift(product)

        localStorage.setItem("recent", JSON.stringify(viewed.slice(0, 4)))

    }, [product])

    const similarProducts = products.filter(
        p => p.category === product.category && p.id !== product.id
    )

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