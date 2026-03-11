import "./DailyDeal.css"
import { useNavigate } from "react-router-dom"

function DailyDeal() {

    const navigate = useNavigate()

    return (

        <section className="deal">

            <div className="dealContainer">

                <img
                    src="/images/RazerKrakenV3X.png"
                    className="dealImage"
                />

                <div className="dealInfo">

                    <h2>⚡ Günün Fırsatı</h2>

                    <p>Razer Kraken V3 X</p>

                </div>

                <div className="dealPrice">

                    <span>3450 TL</span>

                    <button onClick={() => navigate("/product/32")}>
                        Ürünü İncele
                    </button>

                </div>

            </div>

        </section>

    )

}

export default DailyDeal