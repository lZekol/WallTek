import "./DailyDeal.css"
import { useNavigate } from "react-router-dom"

function DailyDeal() {

    const navigate = useNavigate()

    return (

        <section className="deal">

            <div className="dealContainer">

                <img
                    src="/images/rtx4070.png"
                    className="dealImage"
                />

                <div className="dealInfo">

                    <h2>⚡ Günün Fırsatı</h2>

                    <p>RTX 4070 Gaming GPU</p>

                </div>

                <div className="dealPrice">

                    <span>36.000 TL</span>

                    <button onClick={() => navigate("/product/2")}>
                        Ürünü İncele
                    </button>

                </div>

            </div>

        </section>

    )

}

export default DailyDeal