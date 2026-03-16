import "./Header.css"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { supabase } from "../lib/supabase"

import products from "../data/products"

import { FaShoppingCart, FaSearch, FaUser, FaBars } from "react-icons/fa"

function Header({ cartCount, openCart, setSearch, wishlistCount }) {

    const navigate = useNavigate()
    const location = useLocation()
    const cartRef = useRef()

    const [searchText, setSearchText] = useState("")
    const [allProducts, setAllProducts] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const [user, setUser] = useState(null)

    const [menuOpen, setMenuOpen] = useState(false)

    const searchRef = useRef()

    useEffect(() => {

        const fetchProducts = async () => {

            const { data } = await supabase
                .from("products")
                .select("*")

            if (data) {
                setAllProducts(data)
            }

        }

        fetchProducts()

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

                {searchText && searchResults.length > 0 && (

                    <div className="searchDropdown">

                        {searchResults.map((product, index) => (

                            <div
                                key={product.id}
                                className={`searchItem ${index === selectedIndex ? "active" : ""}`}
                                onClick={() => {

                                    navigate(`/product/${product.id}`)
                                    setSearchText("")
                                    setSearch("")
                                }}
                            >

                                <img src={product.image} alt="" />

                                <div>

                                    <span className="searchName">
                                        {product.name}
                                    </span>

                                    <span className="searchPrice">
                                        {product.price.toLocaleString("tr-TR")} TL
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* NAV */}

            <nav className="nav">

                <a onClick={() => navigate("/")}>Anasayfa</a>

                <div className="dropdown">

                    <a>Kategoriler</a>

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

                <a
                    onClick={() => {

                        navigate("/")

                        setTimeout(() => {

                            const el = document.getElementById("products")

                            if (el) {

                                const headerOffset = 90

                                const elementPosition =
                                    el.getBoundingClientRect().top + window.pageYOffset

                                const offsetPosition = elementPosition - headerOffset

                                window.scrollTo({
                                    top: offsetPosition,
                                    behavior: "smooth"
                                })

                                el.classList.add("highlight")

                                setTimeout(() => {
                                    el.classList.remove("highlight")
                                }, 1200)

                            }

                        }, 120)

                    }}
                >
                    Popüler
                </a>

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

            <div className="cart" ref={cartRef} onClick={openCart}>

                <FaShoppingCart />

                <span className={`cartCount ${cartCount > 0 ? "pop" : ""}`}>
                    {cartCount}
                </span>

            </div>


            {/* WISHLIST */}

            <Link to="/wishlist" className="wishlistIcon">

                <span className="heartIcon">❤️</span>

                <span className="wishlistText">
                    Favoriler
                </span>

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
            {menuOpen && <div className="menuOverlay" onClick={() => setMenuOpen(false)}></div>}

            {menuOpen && (

                <div className={`mobileMenu ${menuOpen ? "open" : ""}`}>

                    <Link to="/" onClick={() => setMenuOpen(false)}>Anasayfa</Link>

                    <div className="mobileCategories">

                        <span>Kategoriler</span>

                        <Link to="/category/laptop" onClick={() => setMenuOpen(false)}>Laptop</Link>
                        <Link to="/category/gpu" onClick={() => setMenuOpen(false)}>Ekran Kartı</Link>
                        <Link to="/category/monitor" onClick={() => setMenuOpen(false)}>Monitör</Link>
                        <Link to="/category/headset" onClick={() => setMenuOpen(false)}>Kulaklık</Link>
                        <Link to="/category/mouse" onClick={() => setMenuOpen(false)}>Mouse</Link>
                        <Link to="/category/keyboard" onClick={() => setMenuOpen(false)}>Klavye</Link>
                        <Link to="/category/tv" onClick={() => setMenuOpen(false)}>Televizyon</Link>

                    </div>

                    <Link to="/" onClick={() => setMenuOpen(false)}>Popüler</Link>

                    <Link to="/campaigns" onClick={() => setMenuOpen(false)}>Kampanyalar</Link>

                    <Link to="/orders" onClick={() => setMenuOpen(false)}>Siparişlerim</Link>

                </div>


            )
            }

        </header >

    )

}

export default Header