import { useState, useEffect } from "react"
import "./Admin.css"

function Admin() {

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState("")
    const [category, setCategory] = useState("gpu")
    const [featured, setFeatured] = useState(false)

    const [products, setProducts] = useState([])

    useEffect(() => {

        const stored = JSON.parse(localStorage.getItem("extraProducts")) || []

        setProducts(stored)

    }, [])


    const addProduct = () => {

        if (!name || !price || !image) {
            alert("Tüm alanları doldur")
            return
        }

        const newProduct = {

            id: Date.now(),
            name,
            price: Number(price),
            image: `/images/${image}`,
            category,
            featured

        }

        const stored = JSON.parse(localStorage.getItem("extraProducts")) || []

        const updated = [...stored, newProduct]

        localStorage.setItem("extraProducts", JSON.stringify(updated))

        setProducts(updated)

        setName("")
        setPrice("")
        setImage("")
        setFeatured(false)

        alert("Ürün eklendi")

    }


    const deleteProduct = (id) => {

        const updated = products.filter(p => p.id !== id)

        localStorage.setItem("extraProducts", JSON.stringify(updated))

        setProducts(updated)

    }


    const toggleFeatured = (id) => {

        const updated = products.map(p =>
            p.id === id ? { ...p, featured: !p.featured } : p
        )

        localStorage.setItem("extraProducts", JSON.stringify(updated))

        setProducts(updated)

    }


    return (

        <div className="adminPage">

            <h1 className="adminTitle">Admin Panel</h1>

            <div className="adminForm">

                <input
                    placeholder="Ürün adı"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    placeholder="Fiyat"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <input
                    placeholder="Görsel adı (rtx4080.png)"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />

                {image && (
                    <img
                        src={`/images/${image}`}
                        alt="preview"
                        style={{ width: "120px", marginTop: "10px" }}
                    />
                )}

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >

                    <option value="gpu">GPU</option>
                    <option value="laptop">Laptop</option>
                    <option value="monitor">Monitor</option>
                    <option value="headset">Headset</option>
                    <option value="mouse">Mouse</option>
                    <option value="keyboard">Keyboard</option>
                    <option value="tv">TV</option>

                </select>

                <label style={{ marginTop: "10px" }}>

                    <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                    />

                    Popüler Ürün

                </label>

                <button onClick={addProduct}>
                    Ürün Ekle
                </button>

            </div>


            <h2 style={{ marginTop: "50px" }}>Eklenen Ürünler</h2>


            <div className="adminProducts">

                {products.map(product => (

                    <div className="adminCard" key={product.id}>

                        <img src={product.image} alt={product.name} />

                        <h3>{product.name}</h3>

                        <div className="adminPrice">
                            {product.price} TL
                        </div>

                        <label>

                            <input
                                type="checkbox"
                                checked={product.featured}
                                onChange={() => toggleFeatured(product.id)}
                            />

                            Featured

                        </label>

                        <button
                            className="deleteBtn"
                            onClick={() => deleteProduct(product.id)}
                        >
                            Sil
                        </button>

                    </div>

                ))}

            </div>

        </div>

    )

}

export default Admin