import "./CartDrawer.css"
import { useNavigate } from "react-router-dom"

function CartDrawer({ cart, drawerOpen, closeCart, removeFromCart }) {

    const navigate = useNavigate()

    const total = cart.reduce((sum, item) => sum + item.price, 0)

    const handleCheckout = () => {
        navigate("/login")
    }

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

                cart.map((item, index) => (

                    <div className="cartItem" key={index}>

                        <img src={item.image} alt={item.name} />

                        <div className="cartInfo">

                            <p>{item.name}</p>

                            <span>{item.price.toLocaleString()} ₺</span>

                        </div>

                        <button
                            className="removeBtn"
                            onClick={() => removeFromCart(index)}
                        >
                            🗑
                        </button>

                    </div>

                ))

            )}

            <div className="cartFooter">

                <h4>Toplam: {total.toLocaleString()} ₺</h4>

                <button
                    className="checkoutBtn"
                    onClick={handleCheckout}
                >
                    Satın Al
                </button>

            </div>

        </div>

    )

}

export default CartDrawer