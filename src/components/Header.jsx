import "./Header.css"
import { useNavigate, useLocation } from "react-router-dom"
import { FaShoppingCart } from "react-icons/fa"
import { FaSearch } from "react-icons/fa"
import { FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"

function Header({ cartCount, openCart, setSearch }) {

    const navigate = useNavigate()
    const location = useLocation()

    const goSection = (id) => {

        if (location.pathname !== "/") {

            navigate("/")

            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
            }, 100)

        } else {

            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

        }

        useEffect(() => {

            const handleScroll = () => {

                const header = document.querySelector(".header")

                if (window.scrollY > 50) {
                    header.classList.add("scrolled")
                } else {
                    header.classList.remove("scrolled")
                }

            }

            window.addEventListener("scroll", handleScroll)

            return () => window.removeEventListener("scroll", handleScroll)

        }, [])

    }

    return (

        <header className="header">

            <div className="logo" onClick={() => navigate("/")}>
                WallTek
            </div>

            <div className="searchBox">
                <FaSearch />
                <input
                    className="search"
                    placeholder="Ürün ara..."
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <nav className="nav">

                <a onClick={() => navigate("/")}>Anasayfa</a>

                <div className="dropdown">

                    <a onClick={() => goSection("categories")}>Kategoriler</a>

                    <div className="dropdownMenu">

                        <Link to="/category/laptop">Laptop</Link>
                        <Link to="/category/gpu">Ekran Kartı</Link>
                        <Link to="/category/monitor">Monitör</Link>
                        <Link to="/category/headset">Kulaklık</Link>
                        <Link to="/category/mouse">Mouse</Link>
                        <Link to="/category/keyboard">Klavye</Link>
                        <Link to="/category/tv">Televizyon</Link>

                    </div>

                </div>

                <a onClick={() => goSection("products")}>Popüler</a>

                <Link to="/campaigns">Kampanyalar</Link>

            </nav>

            <Link to="/login" className="loginBtn">
                <FaUser />
                Giriş Yap
            </Link>

            <div className="cart" onClick={openCart}>
                <FaShoppingCart />
                <span className="cartCount">{cartCount}</span>
            </div>

        </header>

    )

}

export default Header