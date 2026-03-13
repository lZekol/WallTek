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

    useEffect(() => {

        const fetchProducts = async () => {

            const { data: products } = await supabase
                .from("products")
                .select("*")

            const { data: reviews } = await supabase
                .from("reviews")
                .select("product_id, rating")

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
        .filter(product =>
            product.category?.toLowerCase() === categoryName?.toLowerCase()
        )
        .filter(product => product.price <= priceRange)


    /* SORTING */

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


            <div className="categoryLayout">


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

                    <div className="sidebarBanner">

                        <h3>🔥 Gaming Week</h3>

                        <p>Seçili ürünlerde %20 indirim</p>

                        <button>Kampanyayı Gör</button>

                    </div>


                    <div className="sidebarProduct">

                        <img src="/images/AsusTufGamingF16FX608.png" />

                        <p>Asus Tuf Gaming F16X608</p>

                        <span>54.999 TL</span>

                    </div>

                </div>


                <div>

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

                        {categoryProducts.length === 0 ? (

                            Array(8).fill().map((_, i) => (
                                <SkeletonCard key={i} />
                            ))

                        ) : (

                            categoryProducts.map(product => (

                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    addToCart={addToCart}
                                    toggleWishlist={toggleWishlist}
                                    wishlist={wishlist}
                                />

                            ))

                        )}

                    </div>

                </div>

            </div>

        </div>

    )

}

export default CategoryPage