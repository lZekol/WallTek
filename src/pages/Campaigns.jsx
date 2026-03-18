import "./Campaigns.css"
import { supabase } from "../lib/supabase"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Campaigns({ addToCart }) {

    const [campaignProducts, setCampaignProducts] = useState([])
    const [time, setTime] = useState(3600)
    const navigate = useNavigate()
    

    // SUPABASE CAMPAIGNS

    useEffect(() => {

        const fetchCampaigns = async () => {

            const { data } = await supabase
                .from("products")
                .select("*")
                .eq("is_campaign", true)

            if (data) setCampaignProducts(data)

        }

        fetchCampaigns()

    }, [])

    // COUNTDOWN

    useEffect(() => {

        const interval = setInterval(() => {

            setTime(prev => {

                if (prev <= 0) return 0
                return prev - 1

            })

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

                <p>%35'e varan indirimler </p>

                <div className="countdown">

                    <span>{hours}h</span>
                    <span>{minutes}m</span>
                    <span>{seconds}s</span>

                </div>

            </div>

            <div className="campaignGrid">

                {campaignProducts.map(product => {

                    const discount = product.old_price
                        ? Math.round(
                            ((product.old_price - product.price) / product.old_price) * 100
                        )
                        : 0

                    return (

                        <div className="campaignCard" key={product.id}>

                            {discount > 0 && (
                                <div className="discountBadge">
                                    %{discount}
                                </div>
                            )}

                            <img
                                src={product.image}
                                alt={product.name}
                                onClick={() => navigate(`/product/${product.id}`)}
                            />

                            <h3
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                {product.name}
                            </h3>

                            <div className="priceArea">

                                {product.old_price && (
                                    <span className="oldPrice">
                                        {product.old_price.toLocaleString("tr-TR")} TL
                                    </span>
                                )}

                                <span className="newPrice">
                                    {product.price.toLocaleString("tr-TR")} TL
                                </span>

                            </div>

                            <button onClick={() => addToCart(product)}>
                                Sepete Ekle
                            </button>

                        </div>

                    )

                })}

            </div>

        </section>

    )

}

export default Campaigns