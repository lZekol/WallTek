import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
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

function App() {

    const [cart, setCart] = useState([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [search, setSearch] = useState("")

    const [toast, setToast] = useState(false)
    const [toastProduct, setToastProduct] = useState("")

    const [wishlist, setWishlist] = useState([])

    /* 🔥 AUTH + WISHLIST SYNC */

    useEffect(() => {

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {

                if (session?.user) {

                    const { data } = await supabase
                        .from("wishlist")
                        .select("*")
                        .eq("user_email", session.user.email)

                    setWishlist(data || [])

                } else {

                    setWishlist([])

                }

            }
        )

        return () => {
            listener.subscription.unsubscribe()
        }

    }, [])

    /* ❤️ HEART ANIMATION */

    const flyHeart = (event) => {

        const heart = document.createElement("div")
        heart.className = "flying-heart"
        heart.innerText = "❤️"

        const start = event.currentTarget.getBoundingClientRect()

        heart.style.left = start.left + "px"
        heart.style.top = start.top + "px"

        document.body.appendChild(heart)

        const target = document.getElementById("wishlist-target")

        if (!target) return

        const end = target.getBoundingClientRect()

        requestAnimationFrame(() => {

            heart.style.transform =
                `translate(${end.left - start.left}px, ${end.top - start.top}px) scale(0.4)`

            heart.style.opacity = "0"

        })

        setTimeout(() => {
            heart.remove()
        }, 700)

    }

    /* 🛒 ADD TO CART */

    const addToCart = (product) => {

        const existing = cart.find(item => item.id === product.id)

        if (existing) {

            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, qty: item.qty + 1 }
                    : item
            ))

        } else {

            setCart([...cart, { ...product, qty: 1 }])

        }

        setToastProduct(product.name)
        setToast(true)

        setTimeout(() => {
            setToast(false)
        }, 2000)

    }

    const increaseQty = (id) => {

        setCart(cart.map(item =>
            item.id === id
                ? { ...item, qty: item.qty + 1 }
                : item
        ))

    }

    const decreaseQty = (id) => {

        setCart(cart
            .map(item =>
                item.id === id
                    ? { ...item, qty: item.qty - 1 }
                    : item
            )
            .filter(item => item.qty > 0)
        )

    }

    const removeFromCart = (id) => {

        setCart(cart.filter(item => item.id !== id))

    }

    /* ❤️ WISHLIST */

    const toggleWishlist = async (product, e) => {

        if (e) {
            e.stopPropagation()
            flyHeart(e)
        }

        const { data: userData } = await supabase.auth.getUser()

        if (!userData.user) {
            alert("Giriş yapmalısın")
            return
        }

        const userEmail = userData.user.email

        const existing = wishlist.find(w => w.product_id === product.id)

        if (existing) {

            await supabase
                .from("wishlist")
                .delete()
                .eq("id", existing.id)

            setWishlist(prev => prev.filter(w => w.id !== existing.id))

        } else {

            const { data } = await supabase
                .from("wishlist")
                .insert([{
                    user_email: userEmail,
                    product_id: product.id
                }])
                .select()

            if (data && data.length > 0) {
                setWishlist(prev => [...prev, data[0]])
            }

        }

    }

    return (

        <Router>

            <ScrollToTop />

            <Header
                cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
                wishlistCount={wishlist.length}
                openCart={() => setDrawerOpen(true)}
                setSearch={setSearch}
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

                <Route
                    path="/"
                    element={
                        <>
                            <Hero />
                            <DailyDeal />
                            <DealsRow addToCart={addToCart} />

                            <Products
                                addToCart={addToCart}
                                search={search}
                                toggleWishlist={toggleWishlist}
                                wishlist={wishlist}
                            />
                        </>
                    }
                />

                <Route
                    path="/category/:categoryName"
                    element={
                        <CategoryPage
                            addToCart={addToCart}
                            toggleWishlist={toggleWishlist}
                            wishlist={wishlist}
                        />
                    }
                />

                <Route
                    path="/product/:id"
                    element={
                        <ProductDetail
                            addToCart={addToCart}
                            toggleWishlist={toggleWishlist}
                            wishlist={wishlist}
                        />
                    }
                />

                <Route
                    path="/campaigns"
                    element={<Campaigns addToCart={addToCart} />}
                />

                <Route
                    path="/wishlist"
                    element={
                        <Wishlist
                            wishlist={wishlist}
                            addToCart={addToCart}
                            toggleWishlist={toggleWishlist}
                        />
                    }
                />

                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/checkout" element={<Checkout cart={cart} />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />

            </Routes>

            <CartToast
                show={toast}
                productName={toastProduct}
            />

        </Router>

    )

}

export default App