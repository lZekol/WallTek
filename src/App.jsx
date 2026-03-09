import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"

import ScrollToTop from "./components/ScrollToTop"
import RefreshToHome from "./components/RefreshToHome"

import Header from "./components/Header"
import Hero from "./components/Hero"
import Categories from "./components/Categories"
import Products from "./components/Products"
import DailyDeal from "./components/DailyDeal"

import CartDrawer from "./components/CartDrawer"
import CartToast from "./components/CartToast"

import CategoryPage from "./pages/CategoryPage"
import ProductDetail from "./pages/ProductDetail"
import Campaigns from "./pages/Campaigns"
import HeroSlider from "./components/HeroSlider"
import Login from "./pages/Login"


function App() {

    const [cart, setCart] = useState([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [search, setSearch] = useState("")

    const [toast, setToast] = useState(false)
    const [toastProduct, setToastProduct] = useState("")

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



    return (

        <Router>

            <ScrollToTop />
            <RefreshToHome />

            <Header
                cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
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
                            <Products addToCart={addToCart} search={search} />
                        </>
                    }
                />

                <Route
                    path="/category/:categoryName"
                    element={<CategoryPage addToCart={addToCart} />}
                />

                <Route
                    path="/product/:id"
                    element={<ProductDetail addToCart={addToCart} />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/campaigns"
                    element={<Campaigns addToCart={addToCart} />}
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