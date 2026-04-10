import { useNavigate } from "react-router-dom"
import "./NotFound.css"

function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="notFoundPage">

            {/* animasyonlu arka plan parçacıkları */}
            <div className="nfParticles">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="nfParticle" style={{
                        left: `${8 + i * 7.5}%`,
                        animationDelay: `${i * 0.4}s`,
                        animationDuration: `${3 + (i % 4)}s`,
                    }} />
                ))}
            </div>

            <div className="nfContent">

                {/* büyük 404 */}
                <div className="nfCode">
                    <span className="nf4 nf4Left">4</span>
                    <div className="nfGlitch">
                        <span className="nfZero">0</span>
                        <div className="nfOrbit">
                            <div className="nfOrbitDot" />
                        </div>
                    </div>
                    <span className="nf4 nf4Right">4</span>
                </div>

                <h1 className="nfTitle">Sayfa bulunamadı</h1>
                <p className="nfDesc">
                    Aradığın sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
                </p>

                <div className="nfActions">
                    <button className="nfBtnPrimary" onClick={() => navigate("/")}>
                        Ana Sayfaya Dön
                    </button>
                    <button className="nfBtnSecondary" onClick={() => navigate(-1)}>
                        ← Geri Git
                    </button>
                </div>

                {/* hızlı linkler */}
                <div className="nfQuickLinks">
                    <span>Hızlı erişim:</span>
                    <button onClick={() => navigate("/category/gpu")}>GPU</button>
                    <button onClick={() => navigate("/category/laptop")}>Laptop</button>
                    <button onClick={() => navigate("/campaigns")}>Kampanyalar</button>
                    <button onClick={() => navigate("/profile")}>Hesabım</button>
                </div>
            </div>
        </div>
    )
}

export default NotFound