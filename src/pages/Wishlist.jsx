import "./Wishlist.css"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import ProductCard from "../components/ProductCard"

function Wishlist({ addToCart, toggleWishlist, wishlist }) {

    const [products, setProducts] = useState([])

    useEffect(() => {

        const getProducts = async () => {

            if (!wishlist || wishlist.length === 0) {
                setProducts([])
                return
            }

            const ids = wishlist.map(w => w.product_id)

            const { data } = await supabase
                .from("products")
                .select("*")
                .in("id", ids)

            setProducts(data || [])

        }

        getProducts()

    }, [wishlist])

    return (

        <section className="wishlistPage">

            <h2>Favoriler ({products.length})</h2>

            {products.length === 0 ? (

                <div className="emptyWishlist">
                    <h3>💔 Favori ürününüz yok</h3>
                </div>

            ) : (

                <div className="productsGrid">

                    {products.map(product => (

                        <ProductCard
                            key={product.id}
                            product={product}
                            addToCart={addToCart}
                            toggleWishlist={toggleWishlist}
                            wishlist={wishlist}
                        />

                    ))}

                </div>

            )}

        </section>

    )

}

export default Wishlist