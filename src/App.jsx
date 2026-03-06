import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"

import Header from "./components/Header"
import Hero from "./components/Hero"
import Categories from "./components/Categories"
import Products from "./components/Products"
import CartDrawer from "./components/CartDrawer"

import CategoryPage from "./pages/CategoryPage"
import ProductDetail from "./pages/ProductDetail"
import Login from "./pages/Login"

function App() {

  const [cart, setCart] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch] = useState("")

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  const removeFromCart = (index) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  return (

    <Router>

      <Header
        cartCount={cart.length}
        openCart={() => setDrawerOpen(true)}
        setSearch={setSearch}
      />

      <CartDrawer
        cart={cart}
        drawerOpen={drawerOpen}
        closeCart={() => setDrawerOpen(false)}
        removeFromCart={removeFromCart}
      />

      <Routes>

        <Route
          path="/"
          element={
            <>
              <Hero />
              <Categories />
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

      </Routes>

    </Router>

  )

}

export default App