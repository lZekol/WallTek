import "./CartDrawer.css"
import { useNavigate } from "react-router-dom"

function CartDrawer({
    cart,
    drawerOpen,
    closeCart,
    increaseQty,
    decreaseQty,
    removeFromCart
}) {

    const navigate = useNavigate()

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty
        , 0)

    return (

        <div className={`cartDrawer ${drawerOpen ? "open" : ""}`}>

            <div className="cartHeader">

                <h3>Sepet</h3>

                <button className="closeBtn" onClick={closeCart}>
                    ✖
                </button>

            </div>

            {cart.length === 0 ? (

                <p>Sepet boş</p>

            ) : (

                cart.map(item => (

                    <div className="cartItem" key={item.id}>

                        <img src={item.image} alt={item.name} />

                        <div className="cartInfo">

                            <p>{item.name}</p>

                            <span>{item.price.toLocaleString("tr-TR")} TL</span>

                            <div className="qtyBox">

                                <button onClick={() => decreaseQty(item.id)}>
                                    -
                                </button>

                                <span>{item.qty}</span>

                                <button onClick={() => increaseQty(item.id)}>
                                    +
                                </button>

                            </div>

                        </div>

                        <button
                            className="removeBtn"
                            onClick={() => removeFromCart(item.id)}
                        >
                            🗑
                        </button>

                    </div>

                ))

            )}

            <div className="cartFooter">

                <h4>Toplam: {total.toLocaleString("tr-TR")} TL</h4>

                <button
                    className="checkoutBtn"
                    onClick={() => navigate("/login")}
                >
                    Satın Al
                </button>

            </div>

        </div>

    )

}

export default CartDrawer