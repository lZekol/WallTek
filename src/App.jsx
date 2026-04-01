import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { supabase } from "./lib/supabase"

import ScrollToTop from "./components/ScrollToTop"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Products from "./components/Products"
import DailyDeal from "./components/DailyDeal"
import DealsRow from "./components/DealsRow"
import CartDrawer from "./components/CartDrawer"
import CartToast from "./components/CartToast"

import CategoryPage from "./pages/CategoryPage"
import ProductDetail from "./pages/ProductDetail"
import Campaigns from "./pages/Campaigns"
import Wishlist from "./pages/Wishlist"
import Admin from "./pages/Admin"
import Login from "./pages/Login"
import Checkout from "./pages/Checkout"
import Orders from "./pages/Orders"
import Profile from "./pages/Profile"

function AppInner() {

    const navigate = useNavigate()

    const [cart, setCart] = useState([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [toast, setToast] = useState(false)
    const [toastProduct, setToastProduct] = useState("")
    const [wishlist, setWishlist] = useState([])
    const [user, setUser] = useState(null)

    /* ── AUTH + WISHLIST SYNC ── */
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data.user)
            if (data.user) {
                const { data: wl } = await supabase
                    .from("wishlist")
                    .select("*")
                    .eq("user_email", data.user.email)
                setWishlist(wl || [])
            }
        }
        getUser()

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null)
            if (session?.user) {
                supabase
                    .from("wishlist")
                    .select("*")
                    .eq("user_email", session.user.email)
                    .then(({ data }) => setWishlist(data || []))
            } else {
                setWishlist([])
            }
        })

        return () => listener.subscription.unsubscribe()
    }, [])

    /* ── HEART ANIMATION ── */
    const flyHeart = (event) => {
        const heart = document.createElement("div")
        heart.innerText = "❤️"
        Object.assign(heart.style, {
            position: "fixed", zIndex: "9999", fontSize: "20px",
            pointerEvents: "none", transition: "all 0.7s ease",
            left: event.currentTarget.getBoundingClientRect().left + "px",
            top: event.currentTarget.getBoundingClientRect().top + "px",
        })
        document.body.appendChild(heart)
        requestAnimationFrame(() => {
            heart.style.transform = "translateY(-120px) scale(0.6)"
            heart.style.opacity = "0"
        })
        setTimeout(() => heart.remove(), 700)
    }

    /* ── ADD TO CART ── */
    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id)
        if (existing) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            ))
        } else {
            setCart([...cart, { ...product, qty: 1 }])
        }
        setToastProduct(product.name)
        setToast(true)
        setTimeout(() => setToast(false), 2000)
    }

    const increaseQty = (id) =>
        setCart(cart.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item))

    const decreaseQty = (id) =>
        setCart(cart.map(item => item.id === id ? { ...item, qty: item.qty - 1 } : item)
            .filter(item => item.qty > 0))

    const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id))

    /* ── WISHLIST ── */
    const toggleWishlist = async (product, e) => {
        if (e) { e.stopPropagation(); flyHeart(e) }

        /* Giriş yoksa → login sayfasına yönlendir, toast/alert yok */
        if (!user) {
            navigate("/login", { state: { from: window.location.pathname } })
            return
        }

        const existing = wishlist.find(w => w.product_id === product.id)

        if (existing) {
            await supabase.from("wishlist").delete().eq("id", existing.id)
            setWishlist(prev => prev.filter(w => w.id !== existing.id))
        } else {
            const { data } = await supabase
                .from("wishlist")
                .insert([{ user_email: user.email, product_id: product.id }])
                .select()
            if (data?.length > 0) setWishlist(prev => [...prev, data[0]])
        }
    }

    const sharedProps = { addToCart, toggleWishlist, wishlist, user }

    return (
        <>
            <ScrollToTop />

            {/* ✅ user prop Header'a geçiliyor — Header artık kendi user state'ini tutmuyor */}
            <Header
                cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
                wishlistCount={wishlist.length}
                openCart={() => setDrawerOpen(true)}
                setSearch={setSearch}
                user={user}
            />

            <CartDrawer
                cart={cart}
                drawerOpen={drawerOpen}
                closeCart={() => setDrawerOpen(false)}
                increaseQty={increaseQty}
                decreaseQty={decreaseQty}
                removeFromCart={removeFromCart}
            />

            <Routes>
                <Route path="/" element={
                    <>
                        <Hero />
                        <DailyDeal />
                        <DealsRow addToCart={addToCart} />
                        <Products {...sharedProps} search={search} />
                    </>
                } />

                <Route path="/category/:categoryName" element={<CategoryPage {...sharedProps} />} />
                <Route path="/product/:id" element={<ProductDetail {...sharedProps} />} />
                <Route path="/campaigns" element={<Campaigns     {...sharedProps} />} />

                <Route path="/wishlist" element={
                    <Wishlist wishlist={wishlist} addToCart={addToCart} toggleWishlist={toggleWishlist} user={user} />
                } />

                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/checkout" element={<Checkout cart={cart} />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile user={user} />} />
            </Routes>

            <CartToast show={toast} productName={toastProduct} />
        </>
    )
}

/* useNavigate Router içinde çalışır — AppInner Router'ın içine alındı */
function App() {
    return (
        <Router>
            <AppInner />
        </Router>
    )
}

export default App