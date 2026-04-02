import "./Header.css"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { supabase } from "../lib/supabase"
import { FaShoppingCart, FaSearch, FaUser, FaBars, FaHeart } from "react-icons/fa"

function Header({ cartCount, openCart, setSearch, wishlistCount, user }) {

    const navigate = useNavigate()
    const location = useLocation()
    const cartRef = useRef()
    const searchRef = useRef()
    const inputRef = useRef()

    const [searchText, setSearchText] = useState("")
    const [allProducts, setAllProducts] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false) // mobil arama toggle

    /* ── ürün listesi ── */
    useEffect(() => {
        supabase.from("products").select("*").then(({ data }) => {
            if (data) setAllProducts(data)
        })
    }, [])

    /* ── sayfa değişince sıfırla ── */
    useEffect(() => {
        setSearchText("")
        setSearch("")
        setSelectedIndex(-1)
        setSearchOpen(false)
    }, [location.pathname])

    /* ── dışarı tıklayınca dropdown kapat ── */
    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSelectedIndex(-1)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const logout = async () => {
        await supabase.auth.signOut()
        navigate("/")
    }

    const handleWishlistClick = (e) => {
        if (!user) {
            e.preventDefault()
            navigate("/login", { state: { from: "/wishlist" } })
        }
    }

    const searchResults = allProducts
        .filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()))
        .slice(0, 6)

    /* ── ikona tıklayınca arama yap / input'a odaklan ── */
    const handleSearchIconClick = () => {
        if (searchText.trim()) {
            /* yazı varsa ara */
            setSearch(searchText)
            navigate("/")
            setSelectedIndex(-1)
        } else {
            /* yazı yoksa input'a fokusla */
            inputRef.current?.focus()
        }
    }

    /* ── klavye navigasyonu ── */
    const handleKeyDown = (e) => {
        if (!searchResults.length) {
            if (e.key === "Enter") {
                setSearch(searchText)
                navigate("/")
            }
            return
        }

        if (e.key === "ArrowDown") {
            e.preventDefault()
            setSelectedIndex(prev =>
                prev < searchResults.length - 1 ? prev + 1 : 0
            )
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setSelectedIndex(prev =>
                prev > 0 ? prev - 1 : searchResults.length - 1
            )
        } else if (e.key === "Enter") {
            e.preventDefault()
            if (selectedIndex >= 0 && searchResults[selectedIndex]) {
                navigate(`/product/${searchResults[selectedIndex].id}`)
                setSearchText("")
                setSearch("")
                setSelectedIndex(-1)
            } else {
                setSearch(searchText)
                navigate("/")
                setSelectedIndex(-1)
            }
        } else if (e.key === "Escape") {
            setSelectedIndex(-1)
            setSearchText("")
            setSearch("")
            inputRef.current?.blur()
        }
    }

    const handleItemClick = (product) => {
        navigate(`/product/${product.id}`)
        setSearchText("")
        setSearch("")
        setSelectedIndex(-1)
    }

    return (
        <header className="header">

            {/* LOGO */}
            <div className="logo" onClick={() => navigate("/")}>WallTek</div>

            {/* SEARCH */}
            <div className={`searchBox${searchOpen ? " searchOpen" : ""}`} ref={searchRef}>
                <input
                    ref={inputRef}
                    className="search"
                    placeholder="Ürün ara..."
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value)
                        setSearch(e.target.value)
                        setSelectedIndex(-1)
                    }}
                    onKeyDown={handleKeyDown}
                />
                {/* ✅ arama ikonu tıklanabilir */}
                <button className="searchIconBtn" onClick={handleSearchIconClick} aria-label="Ara">
                    <FaSearch />
                </button>

                {/* dropdown */}
                {searchText && searchResults.length > 0 && (
                    <div className="searchDropdown">
                        {searchResults.map((product, index) => (
                            <div
                                key={product.id}
                                className={`searchItem${index === selectedIndex ? " searchItem--active" : ""}`}
                                onMouseEnter={() => setSelectedIndex(index)}
                                onMouseLeave={() => setSelectedIndex(-1)}
                                onClick={() => handleItemClick(product)}
                            >
                                <img src={product.image} alt="" />
                                <div>
                                    <span className="searchName">{product.name}</span>
                                    <span className="searchPrice">
                                        {product.price.toLocaleString("tr-TR")} TL
                                    </span>
                                </div>
                                {index === selectedIndex && (
                                    <span className="searchItemArrow">↵</span>
                                )}
                            </div>
                        ))}
                        <div className="searchFooter">
                            <span>↑↓ gezin</span>
                            <span>↵ seç</span>
                            <span>Esc kapat</span>
                        </div>
                    </div>
                )}
            </div>

            {/* NAV */}
            <nav className="nav">
                <a onClick={() => navigate("/")}>Anasayfa</a>

                <div className="dropdown">
                    <a>Kategoriler ⏬︎</a>
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

                <a onClick={() => {
                    navigate("/")
                    setTimeout(() => {
                        const el = document.getElementById("products")
                        if (el) {
                            window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 90, behavior: "smooth" })
                            el.classList.add("highlight")
                            setTimeout(() => el.classList.remove("highlight"), 1200)
                        }
                    }, 120)
                }}>Popüler</a>

                <Link to="/campaigns">Kampanyalar</Link>
            </nav>

            {/* CART */}
            <div className="cart" ref={cartRef} onClick={openCart}>
                <FaShoppingCart />
                <span className={`cartCount${cartCount > 0 ? " pop" : ""}`}>{cartCount}</span>
            </div>

            {/* FAVORİLER */}
            <Link
                to="/wishlist"
                className="wishlistIcon"
                id="wishlist-target"
                onClick={handleWishlistClick}
            >
                <FaHeart className="heartIcon" />
                <span className="wishlistText">Favoriler</span>
                {wishlistCount > 0 && (
                    <span className="wishlistCount">{wishlistCount}</span>
                )}
            </Link>

            {/* USER */}
            {user ? (
                <div className="userArea">
                    <div className="userProfile" onClick={() => navigate("/profile")}>
                        <FaUser />
                        <span>{user.email}</span>
                    </div>
                    <Link to="/orders" className="ordersLink">📦 Siparişlerim</Link>
                    <button onClick={logout} className="logoutBtn">Çıkış</button>
                </div>
            ) : (
                <Link to="/login" className="loginBtn">
                    <FaUser />
                    Giriş Yap
                </Link>
            )}

            {/* MOBİL ARAMA BUTONU */}
            <button
                className="mobileSearchBtn"
                onClick={() => {
                    setSearchOpen(prev => !prev)
                    setTimeout(() => inputRef.current?.focus(), 100)
                }}
                aria-label="Ara"
            >
                <FaSearch />
            </button>

            {/* MOBİL MENÜ BUTONU */}
            <div className="mobileMenuBtn" onClick={() => setMenuOpen(!menuOpen)}>
                <FaBars />
            </div>

            {menuOpen && <div className="menuOverlay" onClick={() => setMenuOpen(false)} />}

            {menuOpen && (
                <div className={`mobileMenu${menuOpen ? " open" : ""}`}>
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
                    <Link to="/wishlist" onClick={(e) => { setMenuOpen(false); handleWishlistClick(e) }}>
                        ❤️ Favoriler {wishlistCount > 0 && `(${wishlistCount})`}
                    </Link>
                    {user && (
                        <Link to="/orders" onClick={() => setMenuOpen(false)}>📦 Siparişlerim</Link>
                    )}
                </div>
            )}
        </header>
    )
}

export default Header