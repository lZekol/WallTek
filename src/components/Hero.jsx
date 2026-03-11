import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Hero.css"

import laptop from "../assets/images/laptop1.png"

import monitor from "../assets/images/msımonitor.png"

function Hero() {

    const navigate = useNavigate()

    const slides = [
        {
            title: "Yeni Nesil Laptoplar",
            desc: "RTX destekli en yeni laptop modelleri",
            img: laptop,
            link: "/category/laptop"
        },
        {
            title: "Gaming Monitörler",
            desc: "240hz ve 4K monitör fırsatları",
            img: monitor,
            link: "/category/monitor"
        }
    ]

    const [index, setIndex] = useState(0)

    useEffect(() => {

        const interval = setInterval(() => {

            setIndex(prev => (prev + 1) % slides.length)

        }, 5000)

        return () => clearInterval(interval)

    }, [])

    const slide = slides[index]

    return (

        <section className="hero">

            <div className="heroContent" key={index}>

                <div className="heroText">

                    <h1>{slide.title}</h1>

                    <p>{slide.desc}</p>

                    <button onClick={() => navigate(slide.link)}>
                        Ürünleri Gör
                    </button>

                </div>

                <div className="heroImgWrapper">

                    <img src={slide.img} className="heroImg" />

                </div>

            </div>

            <div className="heroControls">

                <button className="arrow"
                    onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
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

                <button className="arrow"
                    onClick={() => setIndex((index + 1) % slides.length)}
                >
                    ❯
                </button>

            </div>

        </section>

    )

}

export default Hero