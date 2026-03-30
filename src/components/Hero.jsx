import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Hero.css"

import laptop from "../assets/images/laptop1.png"
import monitor from "../assets/images/msımonitor.png"
import headset from "../assets/images/headset.png"

function Hero() {

    const navigate = useNavigate()

    const slides = [
        {
            title: "Yeni Nesil Laptoplar",
            desc: "RTX destekli en yeni laptop modelleri",
            img: laptop,
            link: "/category/laptop",
        },
        {
            title: "Gaming Monitörler",
            desc: "240hz ve 4K monitör fırsatları",
            img: monitor,
            link: "/category/monitor",
        },
        {
            title: "Profesyonel Gaming Kulaklıklar",
            desc: "7.1 surround oyuncu kulaklıkları",
            img: headset,
            link: "/category/headset",
        }
    ]

    const [index, setIndex] = useState(0)
    const [mouseX, setMouseX] = useState(0)
    const [animKey, setAnimKey] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % slides.length)
            setAnimKey(prev => prev + 1)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const goTo = (i) => {
        setIndex(i)
        setAnimKey(prev => prev + 1)
    }

    const handleMove = (e) => {
        setMouseX(e.clientX / window.innerWidth - 0.5)
    }

    const slide = slides[index]

    return (

        <section className="hero" onMouseMove={handleMove}>

            {/* 🔥 BURASI EN KRİTİK FIX */}
            <div key={animKey} className="heroContent">

                {/* TEXT */}
                <div className="heroText slideIn">

                    <h1>{slide.title}</h1>

                    <p>{slide.desc}</p>

                    <button onClick={() => navigate(slide.link)}>
                        Ürünleri Gör
                    </button>

                </div>

                {/* IMAGE */}
                <div
                    className="heroImgWrapper"
                    style={{ transform: `translateX(${mouseX * 20}px)` }}
                >
                    <img
                        src={slide.img}
                        alt="hero"
                        className="heroImg slideIn"
                    />
                </div>

            </div>

            <div className="heroControls">

                <button
                    className="arrow"
                    onClick={() => goTo((index - 1 + slides.length) % slides.length)}
                >
                    ❮
                </button>

                <div className="heroDots">
                    {slides.map((_, i) => (
                        <span
                            key={i}
                            className={i === index ? "activeDot" : "dot"}
                            onClick={() => goTo(i)}
                        />
                    ))}
                </div>

                <button
                    className="arrow"
                    onClick={() => goTo((index + 1) % slides.length)}
                >
                    ❯
                </button>

            </div>

        </section>

    )

}

export default Hero