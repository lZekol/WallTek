import { useParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import "./CategoryPage.css"
import SkeletonCard from "../components/SkeletonCard"

function CategoryPage({ addToCart, toggleWishlist, wishlist }) {

    const { categoryName } = useParams()

    const [allProducts, setAllProducts] = useState([])
    const [priceRange, setPriceRange] = useState(100000)
    const [sortType, setSortType] = useState("default")
    const [ratingFilter, setRatingFilter] = useState("all")
    const [campaignOnly, setCampaignOnly] = useState(false)

    useEffect(() => {

        const fetchProducts = async () => {

            const { data: products } = await supabase
                .from("products")
                .select("*")

            const { data: reviews } = await supabase
                .from("reviews")
                .select("product_id,rating")

            const productsWithRating = products.map(product => {

                const productReviews = reviews.filter(
                    r => String(r.product_id) === String(product.id)
                )

                const reviewCount = productReviews.length

                const avgRating =
                    reviewCount > 0
                        ? productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
                        : 0

                return {
                    ...product,
                    rating: avgRating,
                    reviewCount
                }

            })

            setAllProducts(productsWithRating)

        }

        fetchProducts()

    }, [])

    let categoryProducts = allProducts
        .filter(p =>
            p.category?.toLowerCase() === categoryName?.toLowerCase()
        )
        .filter(p => p.price <= priceRange)

    if (campaignOnly) {

        categoryProducts = categoryProducts.filter(p => p.old_price)

    }

    if (ratingFilter !== "all") {

        categoryProducts = categoryProducts.filter(
            p => Math.floor(p.rating) >= Number(ratingFilter)
        )

    }

    if (sortType === "priceLow") {

        categoryProducts.sort((a, b) => a.price - b.price)

    }

    if (sortType === "priceHigh") {

        categoryProducts.sort((a, b) => b.price - a.price)

    }

    if (sortType === "newest") {

        categoryProducts.sort((a, b) => b.id - a.id)

    }

    return (

        <div className="categoryPage">

            <h1 className="categoryTitle">
                {categoryName.toUpperCase()}
            </h1>

            <p className="productCount">
                {categoryProducts.length} ürün bulundu
            </p>

            <div className="categoryLayout">


                {/* SIDEBAR */}

                <div className="sidebarWrapper">

                    <div className="filterSidebar">

                        <div className="priceFilter">

                            <span>
                                Fiyat: 0 - {Number(priceRange).toLocaleString("tr-TR")} TL
                            </span>

                            <input
                                type="range"
                                min="0"
                                max="100000"
                                step="1000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                            />

                        </div>



                        <div className="ratingFilter">

                            <span>⭐ Rating</span>

                            <select
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value)}
                            >

                                <option value="all">Tümü</option>
                                <option value="4">4⭐ ve üzeri</option>
                                <option value="3">3⭐ ve üzeri</option>
                                <option value="2">2⭐ ve üzeri</option>

                            </select>

                        </div>


                        <div className="campaignFilter">

                            <label>

                                <input
                                    type="checkbox"
                                    checked={campaignOnly}
                                    onChange={(e) => setCampaignOnly(e.target.checked)}
                                />

                                Sadece indirimli ürünler

                            </label>

                        </div>

                    </div>

                </div>



                {/* PRODUCTS */}

                <div className="categoryProducts">

                    <div className="sortBar">

                        <span>Sırala:</span>

                        <select
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value)}
                        >

                            <option value="default">Varsayılan</option>
                            <option value="priceLow">Fiyat: Düşük → Yüksek</option>
                            <option value="priceHigh">Fiyat: Yüksek → Düşük</option>
                            <option value="newest">En Yeni</option>

                        </select>

                    </div>





                    <div className="productsGrid">

                        {categoryProducts.length === 0 ?

                            Array(8).fill().map((_, i) => (

                                <SkeletonCard key={i} />

                            ))

                            :

                            categoryProducts.map(product => (

                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    addToCart={addToCart}
                                    toggleWishlist={toggleWishlist}
                                    wishlist={wishlist}
                                />

                            ))

                        }

                    </div>

                </div>

            </div>

        </div>

    )

}

export default CategoryPage