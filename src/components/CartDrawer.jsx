import "./CartDrawer.css"
import { useNavigate } from "react-router-dom"
import { FaTimes, FaTrash, FaShoppingBag } from "react-icons/fa"

function CartDrawer({ cart, drawerOpen, closeCart, increaseQty, decreaseQty, removeFromCart }) {

    const navigate = useNavigate()

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0)

    const handleCheckout = () => {
        closeCart()
        navigate("/checkout")
    }

    return (
        <>
            {/* overlay */}
            {drawerOpen && (
                <div className="drawerOverlay" onClick={closeCart} />
            )}

            <div className={`cartDrawer${drawerOpen ? " open" : ""}`}>

                {/* header */}
                <div className="drawerHeader">
                    <div className="drawerHeaderLeft">
                        <FaShoppingBag className="drawerHeaderIcon" />
                        <h2>Sepetim</h2>
                        {itemCount > 0 && (
                            <span className="drawerBadge">{itemCount}</span>
                        )}
                    </div>
                    <button className="drawerClose" onClick={closeCart} aria-label="Kapat">
                        <FaTimes />
                    </button>
                </div>

                {/* ── BOŞ SEPET ── */}
                {cart.length === 0 ? (
                    <div className="drawerEmpty">
                        <div className="drawerEmptyIcon">
                            <FaShoppingBag />
                        </div>
                        <h3>Sepetiniz boş</h3>
                        <p>Beğendiğiniz ürünleri sepete ekleyerek alışverişe başlayın.</p>
                        <button
                            className="drawerShopBtn"
                            onClick={() => { closeCart(); navigate("/") }}
                        >
                            Alışverişe Başla
                        </button>
                        <div className="drawerEmptyCategories">
                            <span>Popüler kategoriler:</span>
                            <div className="drawerCatLinks">
                                {["GPU", "Laptop", "Monitör", "Mouse"].map(cat => (
                                    <button
                                        key={cat}
                                        className="drawerCatBtn"
                                        onClick={() => { closeCart(); navigate(`/category/${cat.toLowerCase() === "monitör" ? "monitor" : cat.toLowerCase()}`) }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* ── ÜRÜN LİSTESİ ── */}
                        <div className="drawerItems">
                            {cart.map(item => (
                                <div className="drawerItem" key={item.id}>
                                    <div
                                        className="drawerItemImg"
                                        onClick={() => { closeCart(); navigate(`/product/${item.id}`) }}
                                    >
                                        <img src={item.image} alt={item.name} />
                                    </div>

                                    <div className="drawerItemInfo">
                                        <p
                                            className="drawerItemName"
                                            onClick={() => { closeCart(); navigate(`/product/${item.id}`) }}
                                        >
                                            {item.name}
                                        </p>
                                        <span className="drawerItemPrice">
                                            {item.price.toLocaleString("tr-TR")} TL
                                        </span>

                                        <div className="drawerItemControls">
                                            {/* miktar */}
                                            <div className="drawerQty">
                                                <button
                                                    className="drawerQtyBtn"
                                                    onClick={() => decreaseQty(item.id)}
                                                    aria-label="Azalt"
                                                >−</button>
                                                <span>{item.qty}</span>
                                                <button
                                                    className="drawerQtyBtn"
                                                    onClick={() => increaseQty(item.id)}
                                                    aria-label="Artır"
                                                >+</button>
                                            </div>

                                            {/* satır toplamı */}
                                            <span className="drawerItemTotal">
                                                {(item.price * item.qty).toLocaleString("tr-TR")} TL
                                            </span>

                                            {/* sil */}
                                            <button
                                                className="drawerRemove"
                                                onClick={() => removeFromCart(item.id)}
                                                aria-label="Kaldır"
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── ÖZET ── */}
                        <div className="drawerSummary">
                            <div className="drawerSummaryRow">
                                <span>Ara Toplam ({itemCount} ürün)</span>
                                <span>{total.toLocaleString("tr-TR")} TL</span>
                            </div>
                            <div className="drawerSummaryRow">
                                <span>Kargo</span>
                                <span className="drawerFreeShip">Ücretsiz</span>
                            </div>
                            <div className="drawerSummaryDivider" />
                            <div className="drawerSummaryRow drawerSummaryTotal">
                                <span>Toplam</span>
                                <strong>{total.toLocaleString("tr-TR")} TL</strong>
                            </div>

                            <button className="drawerCheckoutBtn" onClick={handleCheckout}>
                                Siparişi Tamamla
                            </button>

                            <button className="drawerContinueBtn" onClick={closeCart}>
                                Alışverişe Devam Et
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default CartDrawer