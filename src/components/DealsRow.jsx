import "./DealsRow.css"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"

const deals = [
    { id: 56, name: "TCL 65 inç Akıllı TV", price: 71932, oldPrice: 79999, image: "/images/TCL65inç65Q7C4k.png" },
    { id: 1, name: "RTX 4070", price: 18999, oldPrice: 22999, image: "/images/rtx4070.png" },
    { id: 24, name: "MSI 31.5 MAG321", price: 44999, oldPrice: 47999, image: "/images/MSI31.5MAG321UPQD-OLED.png" },
    { id: 28, name: "Havit Gamenote H2002D", price: 949, oldPrice: 1149, image: "/images/HavitGamenoteH2002D.png" },
    { id: 8, name: "Logitech G G203", price: 799, oldPrice: 1199, image: "/images/LogitechGG203.png" },
    { id: 12, name: "RTX 3050", price: 10837, oldPrice: 14000, image: "/images/rtx3050.png" },
    { id: 35, name: "Logitech G305", price: 1999, oldPrice: 2499, image: "/images/logitech-g305.png" },
]

function DealsRow({ addToCart }) {

    const navigate = useNavigate()
    const [index, setIndex] = useState(0)
    const [addedId, setAddedId] = useState(null)
    const touchStart = useRef(null)
    const intervalRef = useRef(null)

    const startAuto = () => {
        clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
            setIndex(prev => (prev + 1) % deals.length)
        }, 3500)
    }

    useEffect(() => { startAuto(); return () => clearInterval(intervalRef.current) }, [])

    const goTo = (i) => { setIndex(i); startAuto() }
    const next = () => goTo((index + 1) % deals.length)
    const prev = () => goTo((index + deals.length - 1) % deals.length)

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

    /*
        Pozisyon sistemi — 5 kart, 5 slot:
        slot -2 : soldan 2. (gizli)
        slot -1 : soldan 1. (görünür, küçük)
        slot  0 : merkez   (görünür, büyük)
        slot +1 : sağdan 1.(görünür, küçük)
        slot +2 : sağdan 2.(gizli)
    */
    const getSlot = (i) => {
        const total = deals.length
        let diff = (i - index + total) % total
        // -2 ile +2 arasına normalize et
        if (diff > total / 2) diff -= total
        return diff  // -2, -1, 0, 1, 2
    }

    return (
        <section className="dealsRow">

            <div className="dealsHeader">
                <div className="dealsTitleGroup">
                    <span className="dealsFlame">🔥</span>
                    <h2>Günün Fırsatları</h2>
                </div>
            </div>

            <div
                className="dealsStage"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {deals.map((item, i) => {
                    const slot = getSlot(i)
                    const discount = Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
                    const added = addedId === item.id
                    const abs = Math.abs(slot)

                    /* abs > 1 olan kartlar tamamen gizli */
                    if (abs > 2) return null

                    return (
                        <div
                            key={item.id}
                            className={`dealCard dealCard--slot${slot}`}
                            onClick={() => {
                                if (slot === 0) navigate(`/product/${item.id}`)
                                else goTo(i)
                            }}
                        >
                            {/* indirim badge */}
                            <span className="dealDiscountBadge">%{discount}</span>

                            {/* merkez kartta ok butonları */}
                            {slot === 0 && (
                                <>
                                    <button className="dealArrow dealArrow--left" onClick={(e) => { e.stopPropagation(); prev() }}>‹</button>
                                    <button className="dealArrow dealArrow--right" onClick={(e) => { e.stopPropagation(); next() }}>›</button>
                                </>
                            )}

                            <div className="dealImageWrap">
                                <img src={item.image} alt={item.name} />
                            </div>

                            <h4>{item.name}</h4>

                            <div className="dealPriceBox">
                                <span className="dealOldPrice">{item.oldPrice.toLocaleString("tr-TR")} TL</span>
                                <span className="dealNewPrice">{item.price.toLocaleString("tr-TR")} TL</span>
                            </div>

                            {slot === 0 && (
                                <button
                                    className={`dealBtn${added ? " dealBtn--added" : ""}`}
                                    onClick={(e) => handleAddCart(e, item)}
                                >
                                    {added ? "✓ Eklendi" : "Sepete Ekle"}
                                </button>
                            )}
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