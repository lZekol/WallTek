import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import "./ProductDetail.css"

function ProductDetail({ addToCart }) {

    const { id } = useParams()

    const [product, setProduct] = useState(null)
    const [allProducts, setAllProducts] = useState([])
    const [reviews, setReviews] = useState([])
    const [recent, setRecent] = useState([])

    const [newComment, setNewComment] = useState("")
    const [rating, setRating] = useState(5)

    const [user, setUser] = useState(null)
    const [profileName, setProfileName] = useState("")

    const [sort, setSort] = useState("new")

    const [showSticky, setShowSticky] = useState(false)


    // PRODUCTS

    useEffect(() => {

        const fetchProducts = async () => {

            const { data } = await supabase
                .from("products")
                .select("*")

            if (data) {

                setAllProducts(data)

                const found = data.find(p => String(p.id) === String(id))
                setProduct(found)

            }

        }

        fetchProducts()

    }, [id])


    // USER + PROFILE

    useEffect(() => {

        const getUser = async () => {

            const { data } = await supabase.auth.getUser()

            setUser(data.user)

            if (data.user) {

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("email", data.user.email)
                    .single()

                if (!profile) {

                    await supabase.from("profiles").insert([
                        {
                            email: data.user.email,
                            name: data.user.user_metadata?.full_name || data.user.email
                        }
                    ])

                    setProfileName(data.user.user_metadata?.full_name)

                } else {

                    setProfileName(profile.name)

                }

            }

        }

        getUser()

    }, [])


    // REVIEWS

    const fetchReviews = async (productId) => {

        let query = supabase
            .from("reviews")
            .select("*")
            .eq("product_id", productId)

        if (sort === "new") query = query.order("created_at", { ascending: false })
        if (sort === "high") query = query.order("rating", { ascending: false })
        if (sort === "low") query = query.order("rating", { ascending: true })

        const { data } = await query

        if (data) setReviews(data)

    }

    useEffect(() => {

        if (product) {
            fetchReviews(product.id)
        }

    }, [product, sort])


    // AVERAGE

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0


    // ADD REVIEW

    const addReview = async () => {

        if (!newComment) return

        await supabase
            .from("reviews")
            .insert([{
                product_id: Number(product.id),
                user_email: profileName || user?.email || "Anonim",
                rating: Number(rating),
                comment: newComment
            }])

        setNewComment("")
        setRating(5)

        fetchReviews(product.id)

    }


    // LIKE REVIEW

    const likeReview = async (reviewId, currentLikes) => {

        await supabase
            .from("reviews")
            .update({ likes: currentLikes + 1 })
            .eq("id", reviewId)

        fetchReviews(product.id)

    }


    // RECENT PRODUCTS

    useEffect(() => {

        if (!product) return

        let viewed = JSON.parse(localStorage.getItem("recent")) || []

        viewed = viewed.filter(p => p.id !== product.id)

        viewed.unshift(product)

        viewed = viewed.slice(0, 4)

        localStorage.setItem("recent", JSON.stringify(viewed))

        setRecent(viewed)

    }, [product])


    // STICKY CART

    useEffect(() => {

        const handleScroll = () => {

            if (window.scrollY > 400) {
                setShowSticky(true)
            } else {
                setShowSticky(false)
            }

        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)

    }, [])


    if (!product) {

        return (
            <div className="notFound">
                Ürün bulunamadı
            </div>
        )

    }


    const similarProducts = allProducts.filter(
        p => p.category === product.category && p.id !== product.id
    )

    const formatDate = (date) => {

        const d = new Date(date)
        const now = new Date()

        const diff = Math.floor((now - d) / 1000)

        if (diff < 60) return "az önce"
        if (diff < 3600) return Math.floor(diff / 60) + " dk önce"
        if (diff < 86400) return Math.floor(diff / 3600) + " saat önce"

        return Math.floor(diff / 86400) + " gün önce"

    }


    return (

        <div className="productPage">

            {/* PRODUCT */}

            <div className="productDetail">

                <div className="productImage">

                    <img
                        src={product.image}
                        alt={product.name}
                        className="zoomImg"
                    />

                </div>

                <div className="productInfo">

                    <h1>{product.name}</h1>

                    <div className="stars">

                        {"⭐".repeat(Math.floor(averageRating))}
                        {averageRating % 1 >= 0.5 && "⭐"}

                        <span className="ratingText">

                            {averageRating} • {reviews.length} yorum

                        </span>

                    </div>

                    <div className="price">
                        {product.price.toLocaleString("tr-TR")} TL
                    </div>
                    <div className="productMeta">

                        <span>✔ Stokta</span>
                        <span>🚚 Ücretsiz Kargo</span>
                        <span>↩ 14 Gün İade</span>

                    </div>

                    <div className="productDescriptionBox">

                        <h2 className="sectionTitle">
                            Ürün Açıklaması
                        </h2>

                        <p className="productDescription">
                            {product.description}
                        </p>

                    </div>

                    <button onClick={() => addToCart(product)}>
                        Sepete Ekle
                    </button>

                </div>

            </div>


            {/* SIMILAR */}

            <h2 className="sectionTitle">Benzer Ürünler</h2>

            <div className="similarGrid">

                {similarProducts.slice(0, 4).map(item => (

                    <div className="similarCard" key={item.id}>

                        <img src={item.image} alt={item.name} />

                        <h3>{item.name}</h3>

                        <div className="price">
                            {item.price.toLocaleString("tr-TR")} TL
                        </div>

                        <button onClick={() => addToCart(item)}>
                            Sepete Ekle
                        </button>

                    </div>

                ))}

            </div>


            {/* REVIEWS */}

            <h2 className="sectionTitle">Yorumlar</h2>

            <div className="reviewBox">

                <div className="reviewForm">

                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                    >

                        <option value="5">⭐⭐⭐⭐⭐</option>
                        <option value="4">⭐⭐⭐⭐</option>
                        <option value="3">⭐⭐⭐</option>
                        <option value="2">⭐⭐</option>
                        <option value="1">⭐</option>

                    </select>

                    <textarea
                        placeholder="Yorum yaz..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />

                    <button onClick={addReview}>
                        Yorum Gönder
                    </button>

                </div>


                {/* SORT */}

                <div style={{ marginBottom: "20px" }}>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >

                        <option value="new">En Yeni</option>
                        <option value="high">En Yüksek Puan</option>
                        <option value="low">En Düşük Puan</option>

                    </select>

                </div>


                <div className="reviewList">

                    {reviews.map(r => (

                        <div className="reviewItem" key={r.id}>

                            <div className="reviewHeader">

                                <span className="reviewUser">

                                    {r.user_email} • {formatDate(r.created_at)}

                                </span>

                                <span className="reviewStars">

                                    {"⭐".repeat(r.rating)}

                                </span>

                            </div>

                            <p>{r.comment}</p>

                            <button
                                className="reviewLike"
                                onClick={() => likeReview(r.id, r.likes || 0)}
                            >

                                👍 {r.likes || 0}

                            </button>

                        </div>

                    ))}

                </div>

            </div>


            {/* RECENT */}

            {recent.length > 0 && (

                <>

                    <h2 className="sectionTitle">Son Görüntülenenler</h2>

                    <div className="similarGrid">

                        {recent.map(item => (

                            <div className="similarCard" key={item.id}>

                                <img src={item.image} alt={item.name} />

                                <h3>{item.name}</h3>

                                <div className="price">
                                    {item.price.toLocaleString("tr-TR")} TL
                                </div>

                                <button onClick={() => addToCart(item)}>
                                    Sepete Ekle
                                </button>

                            </div>

                        ))}

                    </div>

                </>

            )}


            {/* STICKY CART */}

            {showSticky && (

                <div className="stickyCart">

                    <div className="stickyContent">

                        <span>{product.name}</span>

                        <span className="stickyPrice">
                            {product.price.toLocaleString("tr-TR")} TL
                        </span>

                        <button onClick={() => addToCart(product)}>
                            Sepete Ekle
                        </button>

                    </div>

                </div>

            )}

        </div>

    )

}

export default ProductDetail