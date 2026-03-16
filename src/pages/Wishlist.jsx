import "./Wishlist.css"
import ProductCard from "../components/ProductCard"

function Wishlist({ wishlist, addToCart, toggleWishlist }) {

    return (

        <section className="wishlistPage">

            <h2>
                Favoriler ({wishlist.length})
            </h2>

            {wishlist.length === 0 ? (

                <div className="emptyWishlist">

                    <h3>💔 Favori ürününüz yok</h3>

                    <p>Beğendiğiniz ürünleri favorilere ekleyin</p>

                </div>

            ) : (

                <div className="productsGrid">

                    {wishlist.map(product => (

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