import "./Wishlist.css"

function Wishlist({ wishlist }) {
    
        return (

            <section className="wishlistPage">

                <h2>Favoriler</h2>
               
                <div className="productsGrid">

                    {wishlist.map(product => (

                        <div className="productCard" key={product.id}>

                            <img src={product.image} />

                            <h3>{product.name}</h3>

                            <p>{product.price} TL</p>

                        </div>

                    ))}

                </div>

            </section>

        )

    }

    export default Wishlist