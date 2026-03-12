import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"

import ScrollToTop from "./components/ScrollToTop"
import RefreshToHome from "./components/RefreshToHome"

import Header from "./components/Header"
import Hero from "./components/Hero"
import Products from "./components/Products"
import DailyDeal from "./components/DailyDeal"

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


    /* SEPETE EKLE */

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


    /* ARTTIR */

    const increaseQty = (id) => {

        setCart(cart.map(item =>
            item.id === id
                ? { ...item, qty: item.qty + 1 }
                : item
        ))

    }


    /* AZALT */

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


    /* SİL */

    const removeFromCart = (id) => {

        setCart(cart.filter(item => item.id !== id))

    }


    /* WISHLIST */

    const toggleWishlist = (product) => {

        setWishlist(prev => {

            const exists = prev.find(item => item.id === product.id)

            if (exists) {

                return prev.filter(item => item.id !== product.id)

            } else {

                return [...prev, product]

            }

        })

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
                    element={<ProductDetail addToCart={addToCart} />}
                />

                <Route
                    path="/campaigns"
                    element={<Campaigns addToCart={addToCart} />}
                />

                <Route
                    path="/wishlist"
                    element={<Wishlist wishlist={wishlist} />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/admin"
                    element={<Admin />}
                />

                <Route
                    path="/checkout"
                    element={<Checkout cart={cart} />}
                />

                <Route
                    path="/orders"
                    element={<Orders />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

            </Routes>

            <CartToast
                show={toast}
                productName={toastProduct}
            />

        </Router>

    )

}

export default App