import "./Campaigns.css"
import products from "../data/products"
import { useEffect, useState } from "react"

function Campaigns({ addToCart }) {

    const campaignProducts = products.filter(p => p.discount)

    const [time, setTime] = useState(3600)

    useEffect(() => {

        const interval = setInterval(() => {

            setTime(prev => prev - 1)

        }, 1000)

        return () => clearInterval(interval)

    }, [])

    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60

    return (

        <section className="campaigns">

            <div className="campaignBanner">

                <h2>⚡ Büyük Gaming Kampanyası</h2>

                <p>RTX Laptoplarda kaçırılmayacak fırsatlar</p>

                <div className="countdown">

                    <span>{hours}h</span>
                    <span>{minutes}m</span>
                    <span>{seconds}s</span>

                </div>

            </div>



            <div className="campaignGrid">

                {campaignProducts.map(product => (

                    <div className="campaignCard" key={product.id}>

                        <div className="discountBadge">
                            %{product.discount}
                        </div>

                        <img src={product.image} alt={product.name} />

                        <h3>{product.name}</h3>

                        <div className="priceArea">

                            <span className="oldPrice">
                                {product.oldPrice} TL
                            </span>

                            <span className="newPrice">
                                {product.price} TL
                            </span>

                        </div>

                        <button onClick={() => addToCart(product)}>
                            Sepete Ekle
                        </button>

                    </div>

                ))}

            </div>

        </section>

    )

}

export default Campaigns