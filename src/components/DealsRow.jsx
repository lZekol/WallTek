import "./DealsRow.css"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"

function DealsRow({ addToCart }) {

    const navigate = useNavigate()
    const [index, setIndex] = useState(0)
    const touchStart = useRef(null)

    const deals = [
        {
            id: 56,
            name: "TCL 65 inc Akıllı TV",
            price: 71932,
            oldPrice: 79999,
            image: "/images/TCL65inç65Q7C4k.png"
        },
        {
            id: 1,
            name: "RTX 4070",
            price: 18999,
            oldPrice: 22999,
            image: "/images/rtx4070.png"
        },
        {
            id: 24,
            name: "MSI 31.5 MAG321",
            price: 44999,
            oldPrice: 47999,
            image: "/images/MSI31.5MAG321UPQD-OLED.png"
        },
        {
            id: 28,
            name: "Havit Gamenote H2002D",
            price: 949,
            oldPrice: 1149,
            image: "/images/HavitGamenoteH2002D.png"
        },
        {
            id: 8,
            name: "Logitech G G203",
            price: 799,
            oldPrice: 1199,
            image: "/images/LogitechGG203.png"
        }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % deals.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    const next = () => setIndex(prev => (prev + 1) % deals.length)
    const prev = () => setIndex(prev => prev === 0 ? deals.length - 1 : prev - 1)

    /* SWIPE */
    const handleTouchStart = (e) => {
        touchStart.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e) => {
        const end = e.changedTouches[0].clientX

        if (touchStart.current - end > 50) next()
        if (touchStart.current - end < -50) prev()
    }

    return (

        <section className="dealsRow">

            <div className="dealsHeader">
                <h2>🔥 Fırsatlar</h2>
                <div className="arrows">
                    <button onClick={prev}>‹</button>
                    <button onClick={next}>›</button>
                </div>
            </div>

            <div
                className="slider"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >

                {deals.map((item, i) => {

                    const discount = Math.round(
                        ((item.oldPrice - item.price) / item.oldPrice) * 100
                    )

                    return (

                        <div
                            key={item.id}
                            className={`dealCard ${i === index ? "active" : ""}`}
                            onClick={() => navigate(`/product/${item.id}`)}
                        >

                            <span className="dealDiscount">%{discount}</span>

                            <img src={item.image} alt={item.name} />

                            <h4>{item.name}</h4>

                            <div className="priceBox">

                                <span className="oldPrice">
                                    {item.oldPrice.toLocaleString("tr-TR")} TL
                                </span>

                                <span className="newPrice">
                                    {item.price.toLocaleString("tr-TR")} TL
                                </span>

                            </div>

                            {/* 💥 FIX BURASI */}
                            <button
                                className="dealBtn"
                                onClick={(e) => {
                                    e.stopPropagation()

                                    addToCart({
                                        id: item.id,
                                        name: item.name,
                                        price: item.price,
                                        image: item.image
                                    })
                                }}
                            >
                                Sepete Ekle
                            </button>

                        </div>

                    )

                })}

            </div>

        </section>

    )

}

export default DealsRow