import "./DealsRow.css"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"

const deals = [
    { id: 56, name: "TCL 65 inç Akıllı TV", price: 71932, oldPrice: 79999, image: "/images/TCL65inç65Q7C4k.png" },
    { id: 1, name: "RTX 4070", price: 18999, oldPrice: 22999, image: "/images/rtx4070.png" },
    { id: 24, name: "MSI 31.5 MAG321", price: 44999, oldPrice: 47999, image: "/images/MSI31.5MAG321UPQD-OLED.png" },
    { id: 28, name: "Havit Gamenote H2002D", price: 949, oldPrice: 1149, image: "/images/HavitGamenoteH2002D.png" },
    { id: 8, name: "Logitech G G203", price: 799, oldPrice: 1199, image: "/images/LogitechGG203.png" },
]

function DealsRow({ addToCart }) {

    const navigate = useNavigate()
    const [index, setIndex] = useState(0)
    const [addedId, setAddedId] = useState(null)
    const touchStart = useRef(null)
    const intervalRef = useRef(null)

    const startAuto = () => {
        intervalRef.current = setInterval(() => {
            setIndex(prev => (prev + 1) % deals.length)
        }, 3500)
    }

    useEffect(() => {
        startAuto()
        return () => clearInterval(intervalRef.current)
    }, [])

    const goTo = (i) => {
        clearInterval(intervalRef.current)
        setIndex(i)
        startAuto()
    }

    const next = () => goTo((index + 1) % deals.length)
    const prev = () => goTo(index === 0 ? deals.length - 1 : index - 1)

    const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
    const handleTouchEnd = (e) => {
        const diff = touchStart.current - e.changedTouches[0].clientX
        if (diff > 50) next()
        if (diff < -50) prev()
    }

    const handleAddCart = (e, item) => {
        e.stopPropagation()
        addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })
        setAddedId(item.id)
        setTimeout(() => setAddedId(null), 1500)
    }

    /* visible cards: active ± 1 */
    const getPos = (i) => {
        const total = deals.length
        const diff = (i - index + total) % total
        if (diff === 0) return "center"
        if (diff === 1) return "right"
        if (diff === total - 1) return "left"
        return "hidden"
    }

    return (
        <section className="dealsRow">

            <div className="dealsHeader">
                <div className="dealsTitleGroup">
                    <span className="dealsFlame">🔥</span>
                    <h2>Günün Fırsatları</h2>
                </div>
                <div className="dealsArrows">
                    <button onClick={prev} aria-label="Önceki">‹</button>
                    <button onClick={next} aria-label="Sonraki">›</button>
                </div>
            </div>

            <div
                className="dealsSlider"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {deals.map((item, i) => {
                    const pos = getPos(i)
                    const discount = Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
                    const added = addedId === item.id

                    return (
                        <div
                            key={item.id}
                            className={`dealCard dealCard--${pos}`}
                            onClick={() => pos === "center" && navigate(`/product/${item.id}`)}
                        >
                            <span className="dealDiscountBadge">%{discount}</span>

                            <div className="dealImageWrap">
                                <img src={item.image} alt={item.name} />
                            </div>

                            <h4>{item.name}</h4>

                            <div className="dealPriceBox">
                                <span className="dealOldPrice">{item.oldPrice.toLocaleString("tr-TR")} TL</span>
                                <span className="dealNewPrice">{item.price.toLocaleString("tr-TR")} TL</span>
                            </div>

                            <button
                                className={`dealBtn${added ? " dealBtn--added" : ""}`}
                                onClick={(e) => handleAddCart(e, item)}
                            >
                                {added ? "✓ Eklendi" : "Sepete Ekle"}
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* dot indicators */}
            <div className="dealsDots">
                {deals.map((_, i) => (
                    <button
                        key={i}
                        className={`dealDot${i === index ? " dealDot--active" : ""}`}
                        onClick={() => goTo(i)}
                        aria-label={`Slayt ${i + 1}`}
                    />
                ))}
            </div>

        </section>
    )
}

export default DealsRow