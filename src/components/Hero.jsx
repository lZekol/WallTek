import "./Hero.css"
import { useNavigate } from "react-router-dom"
import laptop from "../assets/images/laptop1.png"

function Hero() {

    const navigate = useNavigate()

    return (

        <section className="hero">

            <div className="heroContainer">

                <div className="heroText">

                    <h1>Yeni Nesil Teknoloji</h1>

                    <p>RTX 40 serisi ekran kartları ve gaming ekipmanları</p>

                    <button onClick={() => navigate("/category/laptop")}>
                        Ürünleri Gör
                    </button>

                </div>

                <div className="heroImage">

                    <img src={laptop} alt="hero" />

                </div>

            </div>

        </section>

    )

}

export default Hero