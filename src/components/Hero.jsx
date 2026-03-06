import "./Hero.css"
import laptop from "../assets/images/laptop1.png"

function Hero() {

    return (

        <section id="hero" className="hero">

            <div className="heroContainer">

                <div className="heroText">

                    <h1>Yeni Nesil Teknoloji</h1>

                    <p>
                        En yeni laptoplar, ekran kartları ve teknoloji ürünleri burada.
                    </p>

                    <button className="heroBtn">
                        Ürünleri İncele
                    </button>

                </div>

                <div className="heroImage">

                    <img src={laptop} alt="Laptop" />

                </div>

            </div>

        </section>

    )

}

export default Hero