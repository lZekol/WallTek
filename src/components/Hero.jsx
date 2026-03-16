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
            direction: "left"
        },
        {
            title: "Gaming Monitörler",
            desc: "240hz ve 4K monitör fırsatları",
            img: monitor,
            link: "/category/monitor",
            direction: "right"
        },
        {
            title: "Profesyonel Gaming Kulaklıklar",
            desc: "7.1 surround ve düşük gecikmeli oyuncu kulaklıkları",
            img: headset,
            link: "/category/headset",
            direction: "right",
            textDirection: "right"
        }
    ]

    const [index, setIndex] = useState(0)
    const [mouseX, setMouseX] = useState(0)

    useEffect(() => {

        const interval = setInterval(() => {

            setIndex(prev => (prev + 1) % slides.length)

        }, 5000)

        return () => clearInterval(interval)

    }, [])

    const handleMove = (e) => {

        setMouseX(e.clientX / window.innerWidth - 0.5)

    }

    const slide = slides[index]

    return (

        <section className="hero" onMouseMove={handleMove}>

            <div className="heroContent">

                <div
                    key={index}
                    className={`heroText ${slide.textDirection === "right"
                            ? "slideRightText"
                            : "slideText"
                        }`}
                >

                    <h1>{slide.title}</h1>

                    <p>{slide.desc}</p>

                    <button onClick={() => navigate(slide.link)}>
                        Ürünleri Gör
                    </button>

                </div>

                <div
                    className="heroImgWrapper"
                    style={{
                        transform: `translateX(${mouseX * 20}px)`
                    }}
                >

                    <img
                        key={index}
                        src={slide.img}
                        alt="hero"
                        className={`heroImg ${slide.direction === "left"
                                ? "slideLeftImg"
                                : "slideRightImg"
                            }`}
                    />

                </div>

            </div>

            <div className="heroControls">

                <button
                    className="arrow"
                    onClick={() =>
                        setIndex((index - 1 + slides.length) % slides.length)
                    }
                >
                    ❮
                </button>

                <div className="heroDots">

                    {slides.map((s, i) => (
                        <span
                            key={i}
                            className={i === index ? "activeDot" : "dot"}
                            onClick={() => setIndex(i)}
                        />
                    ))}

                </div>

                <button
                    className="arrow"
                    onClick={() => setIndex((index + 1) % slides.length)}
                >
                    ❯
                </button>

            </div>

        </section>

    )

}

export default Hero