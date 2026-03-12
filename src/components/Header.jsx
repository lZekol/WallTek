import "./Header.css"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { supabase } from "../lib/supabase"

import { FaShoppingCart, FaSearch, FaUser, FaBars } from "react-icons/fa"

import products from "../data/products"

function Header({ cartCount, openCart, setSearch, wishlistCount }) {

    const navigate = useNavigate()
    const location = useLocation()

    const [searchText, setSearchText] = useState("")
    const [allProducts, setAllProducts] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const [user, setUser] = useState(null)

    const [menuOpen, setMenuOpen] = useState(false)

    const searchRef = useRef()

    useEffect(() => {

        const extraProducts = JSON.parse(localStorage.getItem("extraProducts")) || []
        setAllProducts([...products, ...extraProducts])

    }, [])


    /* USER */

    useEffect(() => {

        const getUser = async () => {

            const { data } = await supabase.auth.getUser()
            setUser(data.user)

        }

        getUser()

    }, [])


    const logout = async () => {

        await supabase.auth.signOut()
        setUser(null)
        navigate("/")

    }


    useEffect(() => {

        setSearchText("")
        setSearch("")
        setSelectedIndex(-1)

    }, [location.pathname])


    const searchResults = allProducts
        .filter(product =>
            product.name.toLowerCase().includes(searchText.toLowerCase())
        )
        .slice(0, 5)


    const handleSearch = (e) => {

        if (e.key === "Enter") {

            setSearch(searchText)
            navigate("/")

        }

    }


    return (

        <header className="header">

            <div className="logo" onClick={() => navigate("/")}>
                WallTek
            </div>


            {/* SEARCH */}

            <div className="searchBox" ref={searchRef}>

                <FaSearch />

                <input
                    className="search"
                    placeholder="Ürün ara..."
                    value={searchText}

                    onChange={(e) => {

                        setSearchText(e.target.value)
                        setSearch(e.target.value)

                    }}

                    onKeyDown={handleSearch}
                />

            </div>


            {/* NAV */}

            <nav className="nav">

                <a onClick={() => navigate("/")}>Anasayfa</a>

                <Link to="/category/laptop">Kategoriler</Link>

                <a onClick={() => navigate("/")}>Popüler</a>

                <Link to="/campaigns">Kampanyalar</Link>

            </nav>


            {/* USER */}

            {user ? (

                <div className="userArea">

                    <div
                        className="userProfile"
                        onClick={() => navigate("/profile")}
                    >

                        <FaUser />
                        <span>{user.email}</span>

                    </div>

                    <button onClick={logout} className="logoutBtn">
                        Çıkış
                    </button>

                </div>

            ) : (

                <Link to="/login" className="loginBtn">

                    <FaUser />
                    Giriş Yap

                </Link>

            )}


            {/* CART */}

            <div className="cart" onClick={openCart}>

                <FaShoppingCart />

                <span className="cartCount">
                    {cartCount}
                </span>

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


            <Link to="/orders" className="ordersLink">
                📦 Siparişlerim
            </Link>


            {/* MOBILE MENU BUTTON */}

            <div
                className="mobileMenuBtn"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <FaBars />
            </div>


            {/* MOBILE MENU */}

            {menuOpen && (

                <div className="mobileMenu">

                    <Link to="/" onClick={() => setMenuOpen(false)}>Anasayfa</Link>

                    <Link to="/category/laptop" onClick={() => setMenuOpen(false)}>Kategoriler</Link>

                    <Link to="/" onClick={() => setMenuOpen(false)}>Popüler</Link>

                    <Link to="/campaigns" onClick={() => setMenuOpen(false)}>Kampanyalar</Link>

                    <Link to="/orders" onClick={() => setMenuOpen(false)}>Siparişlerim</Link>

                </div>

            )}

        </header>

    )

}

export default Header