import { Link } from "react-router-dom"
import "./Header.css"

function Header({ cartCount, openCart, setSearch }) {

    const scrollTo = (id) => {

        const section = document.getElementById(id)

        if (section) {

            section.scrollIntoView({ behavior: "smooth" })

        }

    }

    return (

        <header className="header">

            <div className="logo">
                <Link to="/">WallTek</Link>
            </div>

            <input
                className="search"
                placeholder="Ürün ara..."
                onChange={(e) => setSearch(e.target.value)}
            />

            <nav className="nav">

                <button onClick={() => scrollTo("hero")}>
                    Anasayfa
                </button>

                <button onClick={() => scrollTo("categories")}>
                    Kategoriler
                </button>

                <button onClick={() => scrollTo("products")}>
                    Popüler
                </button>

            </nav>

            <div className="actions">

                <div className="cart" onClick={openCart}>
                    🛒
                    <span className="cartCount">{cartCount}</span>
                </div>

                <Link to="/login" className="loginBtn">
                    Giriş Yap
                </Link>

            </div>

        </header>

    )

}

export default Header