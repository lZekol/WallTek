import { useState } from "react";

import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Products from "../components/Products";
import CartDrawer from "../components/CartDrawer";

function Home({ cartItems, setCartItems }) {

    const [cartOpen, setCartOpen] = useState(false);

    return (
        <>

            <Header
                cartCount={cartItems.length}
                setCartOpen={setCartOpen}
            />

            <Hero />

            <Categories />

            <Products setCartItems={setCartItems} />

            <CartDrawer
                cartItems={cartItems}
                cartOpen={cartOpen}
                setCartOpen={setCartOpen}
            />

        </>
    );
}

export default Home;