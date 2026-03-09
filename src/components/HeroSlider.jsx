import "./HeroSlider.css"
import { useNavigate } from "react-router-dom"

function HeroSlider() {

    const navigate = useNavigate()

    return (

        <section className="heroSlider">

            <div className="heroSliderContent">

                <h2>Yeni Nesil Ekran Kartları</h2>

                <p>RTX 40 serisi stokta</p>

                <button onClick={() => navigate("/category/gpu")}>
                    Ürünleri Gör
                </button>

            </div>

        </section>

    )

}

export default HeroSlider