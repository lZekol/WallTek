import "./Header.css"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useState, useEffect } from "react"

import { FaShoppingCart } from "react-icons/fa"
import { FaSearch } from "react-icons/fa"
import { FaUser } from "react-icons/fa"

import products from "../data/products"

function Header({ cartCount, openCart, setSearch, wishlistCount }) {

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        setSearchText("")
        setSearch("")

    }, [location.pathname])

    /* SEARCH STATE */

    const [searchText, setSearchText] = useState("")

    /* SEARCH RESULTS */

    const searchResults = products
        .filter(product =>
            product.name.toLowerCase().includes(searchText.toLowerCase())
        )
        .slice(0, 5)

    /* HEADER SCROLL EFFECT */

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

    /* NAV SCROLL */

    const goSection = (id) => {

        if (location.pathname !== "/") {

            navigate("/")

            setTimeout(() => {

                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

            }, 100)

        } else {

            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

        }

    }

    return (

        <header className="header">

            <div className="logo" onClick={() => navigate("/")}>
                WallTek
            </div>


            {/* SEARCH */}

            <div className="searchBox">

                <FaSearch />

                <input
                    className="search"
                    placeholder="Ürün ara..."
                    value={searchText}
                    onChange={(e) => {

                        setSearchText(e.target.value)
                        setSearch(e.target.value)

                    }}
                />

                {/* SEARCH DROPDOWN */}

                {searchText && (

                    <div className="searchDropdown">

                        {searchResults.map(product => (

                            <div
                                key={product.id}
                                className="searchItem"
                                onClick={() => {

                                    navigate(`/product/${product.id}`)
                                    setSearchText("")

                                }}
                            >

                                <img src={product.image} alt={product.name} />

                                <span>{product.name}</span>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* NAV */}

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


            {/* LOGIN */}

            <Link to="/login" className="loginBtn">
                <FaUser />
                Giriş Yap
            </Link>


            {/* CART */}

            <div className="cart" onClick={openCart}>
                <FaShoppingCart />
                <span className="cartCount">{cartCount}</span>
            </div>


            {/* WISHLIST */}

            <Link to="/wishlist" className="wishlistIcon">

                ❤️

                {wishlistCount > 0 && (

                    <span className="wishlistCount">
                        {wishlistCount}
                    </span>

                )}

            </Link>

        </header>

    )

}

export default Header