import "./Header.css"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { supabase } from "../lib/supabase"

import { FaShoppingCart, FaSearch, FaUser } from "react-icons/fa"

import products from "../data/products"

function Header({ cartCount, openCart, setSearch, wishlistCount }) {

    const navigate = useNavigate()
    const location = useLocation()

    const [searchText, setSearchText] = useState("")
    const [allProducts, setAllProducts] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const [user, setUser] = useState(null)

    const searchRef = useRef()

    useEffect(() => {

        const extraProducts = JSON.parse(localStorage.getItem("extraProducts")) || []

        setAllProducts([...products, ...extraProducts])

    }, [])


    /* SUPABASE USER */

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


    /* SAYFA DEĞİŞİNCE SEARCH TEMİZLE */

    useEffect(() => {

        setSearchText("")
        setSearch("")
        setSelectedIndex(-1)

    }, [location.pathname])


    /* SEARCH RESULTS */

    const searchResults = allProducts
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



    /* KEYBOARD SEARCH */

    const handleSearch = (e) => {

        if (e.key === "ArrowDown") {

            e.preventDefault()

            setSelectedIndex(prev =>
                prev < searchResults.length - 1 ? prev + 1 : prev
            )

        }

        if (e.key === "ArrowUp") {

            e.preventDefault()

            setSelectedIndex(prev =>
                prev > 0 ? prev - 1 : -1
            )

        }

        if (e.key === "Enter") {

            if (selectedIndex >= 0) {

                const product = searchResults[selectedIndex]

                navigate(`/product/${product.id}`)
                setSearchText("")

            } else {

                setSearch(searchText)
                navigate("/")

            }

        }

    }



    /* DROPDOWN DIŞINA TIKLAMA */

    useEffect(() => {

        const handleClick = (e) => {

            if (!searchRef.current?.contains(e.target)) {

                setSearchText("")

            }

        }

        document.addEventListener("click", handleClick)

        return () => document.removeEventListener("click", handleClick)

    }, [])



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

            <div className="searchBox" ref={searchRef}>

                <FaSearch />

                <input
                    className="search"
                    placeholder="Ürün ara..."
                    value={searchText}

                    onChange={(e) => {

                        setSearchText(e.target.value)
                        setSearch(e.target.value)
                        setSelectedIndex(-1)

                    }}

                    onKeyDown={handleSearch}
                />


                {searchText && searchResults.length > 0 && (

                    <div className="searchDropdown">

                        {searchResults.map((product, index) => (

                            <div
                                key={product.id}
                                className="searchItem"
                                style={{
                                    background:
                                        index === selectedIndex
                                            ? "#f3f3f3"
                                            : "white"
                                }}

                                onClick={() => {

                                    navigate(`/product/${product.id}`)
                                    setSearchText("")

                                }}

                            >

                                <img src={product.image} alt={product.name} />

                                <div>

                                    <span>{product.name}</span>

                                    <p>{product.price} TL</p>

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

        </header>

    )

}

export default Header