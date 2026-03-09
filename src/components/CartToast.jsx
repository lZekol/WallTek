import "./CartToast.css"

function CartToast({ show, productName }) {

    if (!show) return null

    return (

        <div className="toast">

            ✅ {productName} sepete eklendi

        </div>

    )

}

export default CartToast