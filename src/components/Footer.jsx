import "./Footer.css"
import { Link } from "react-router-dom"
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"

function Footer() {

    return (

        <footer className="footer">

            <div className="footerTop">

                {/* LOGO */}
                <div className="footerCol">
                    <h2 className="footerLogo">WallTek</h2>
                    <p>
                        Teknolojinin en iyi ürünlerini en uygun fiyatlarla sunar.
                    </p>
                </div>

                {/* MENÜ */}
                <div className="footerCol">
                    <h4>Keşfet</h4>
                    <Link to="/">Ana Sayfa</Link>
                    <Link to="/campaigns">Kampanyalar</Link>
                    <Link to="/wishlist">Favoriler</Link>
                </div>

                {/* KATEGORİ */}
                <div className="footerCol">
                    <h4>Kategoriler</h4>
                    <Link to="/category/gpu">GPU</Link>
                    <Link to="/category/laptop">Laptop</Link>
                    <Link to="/category/monitor">Monitor</Link>
                </div>

                {/* SOSYAL */}
                <div className="footerCol">
                    <h4>Bizi Takip Et</h4>
                    <div className="socials">
                        <FaInstagram />
                        <FaTwitter />
                        <FaYoutube />
                    </div>
                </div>

            </div>

            <div className="footerBottom">
                © 2026 WallTek — Tüm hakları saklıdır.
            </div>

        </footer>

    )

}

export default Footer