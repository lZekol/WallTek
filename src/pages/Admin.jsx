import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import "./Admin.css"

function Admin() {

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState("")
    const [search, setSearch] = useState("")
    const [editPrice, setEditPrice] = useState({})
    const [category, setCategory] = useState("gpu")
    const [featured, setFeatured] = useState(false)

    const [products, setProducts] = useState([])

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {

        const { data, error } = await supabase
            .from("products")
            .select("*")

        if (!error) setProducts(data)

    }

    const updatePrice = async (id) => {

        const newPrice = editPrice[id]
        if (!newPrice) return

        const { error } = await supabase
            .from("products")
            .update({ price: Number(newPrice) })
            .eq("id", id)

        if (!error) fetchProducts()

    }

    const addProduct = async () => {

        if (!name || !price || !image) {
            alert("Tüm alanları doldur")
            return
        }

        const parsedPrice = Number(price)

        if (isNaN(parsedPrice)) {
            alert("Fiyat geçersiz")
            return
        }

        const { error } = await supabase
            .from("products")
            .insert([
                {
                    name: name.trim(),
                    price: parsedPrice,
                    image: `/images/${image.trim()}`,
                    category,
                    featured
                }
            ])

        if (error) {

            console.log(error) // 🔥 bunu ekledim
            alert("Ürün eklenemedi")

        } else {

            alert("Ürün eklendi")

            setName("")
            setPrice("")
            setImage("")
            setFeatured(false)

            fetchProducts()

        }

    }

    const toggleCampaign = async (product) => {

        const { error } = await supabase
            .from("products")
            .update({
                is_campaign: !product.is_campaign
            })
            .eq("id", product.id)

        if (!error) fetchProducts()

    }

    const deleteProduct = async (id) => {

        await supabase
            .from("products")
            .delete()
            .eq("id", id)

        fetchProducts()

    }

    const toggleFeatured = async (product) => {

        await supabase
            .from("products")
            .update({ featured: !product.featured })
            .eq("id", product.id)

        fetchProducts()

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

                <label>

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

            <input
                className="adminSearch"
                placeholder="Ürün ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <h2>Eklenen Ürünler</h2>

            <div className="adminProducts">

                {products
                    .filter(p =>
                        p.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map(product => (

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
                                    onChange={() => toggleFeatured(product)}
                                />

                                Featured

                            </label>

                            <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>

                                <input
                                    className="priceInput"
                                    type="number"
                                    placeholder="Yeni fiyat"
                                    value={editPrice[product.id] || ""}
                                    onChange={(e) =>
                                        setEditPrice({
                                            ...editPrice,
                                            [product.id]: e.target.value
                                        })
                                    }
                                />

                                <button
                                    className="priceUpdateBtn"
                                    onClick={() => updatePrice(product.id)}
                                >
                                    Güncelle
                                </button>

                            </div>

                            <button
                                className={
                                    product.is_campaign
                                        ? "campaignRemoveBtn"
                                        : "campaignAddBtn"
                                }
                                onClick={() => toggleCampaign(product)}
                            >

                                {product.is_campaign
                                    ? "Kampanyadan Kaldır"
                                    : "Kampanyaya Ekle"}

                            </button>

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