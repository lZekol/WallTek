import "./Campaigns.css"
import { supabase } from "../lib/supabase"
import { useEffect, useState } from "react"
import ProductCard from "../components/ProductCard"

function Campaigns({ addToCart, toggleWishlist, wishlist, user }) {

    const [campaignProducts, setCampaignProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [time, setTime] = useState(24 * 3600)

    /* ── fetch ── */
    useEffect(() => {
        const fetchCampaigns = async () => {
            const { data } = await supabase
                .from("products")
                .select("*")
                .eq("is_campaign", true)
            setCampaignProducts(data || [])
            setLoading(false)
        }
        fetchCampaigns()
    }, [])

    /* ── countdown ── */
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prev => (prev <= 0 ? 0 : prev - 1))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const pad = n => String(n).padStart(2, "0")
    const hrs = pad(Math.floor(time / 3600))
    const mins = pad(Math.floor((time % 3600) / 60))
    const secs = pad(time % 60)

    return (
        <section className="campaigns">
            <div className="campaignsInner">

                {/* ── BANNER ── */}
                <div className="campaignBanner">
                    <div className="bannerLeft">
                        <div className="bannerEyebrow">
                            <span className="bannerPulse" />
                            Sınırlı Süreli Fırsat
                        </div>
                        <h2>⚡ Büyük Gaming<br />Kampanyası</h2>
                        <p>Seçili ürünlerde %35'e varan indirimler</p>
                    </div>

                    <div className="bannerRight">
                        <span className="countdownLabel">Kampanya bitimine kalan</span>
                        <div className="countdown">
                            <div className="countUnit">
                                <span className="countNum">{hrs}</span>
                                <span className="countSub">Saat</span>
                            </div>
                            <span className="countSep">:</span>
                            <div className="countUnit">
                                <span className="countNum">{mins}</span>
                                <span className="countSub">Dakika</span>
                            </div>
                            <span className="countSep">:</span>
                            <div className="countUnit">
                                <span className="countNum">{secs}</span>
                                <span className="countSub">Saniye</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── SECTION HEADER ── */}
                <div className="campaignSectionHeader">
                    <h3>Kampanyalı Ürünler</h3>
                    <span className="campaignCount">
                        {loading ? "…" : `${campaignProducts.length} ürün`}
                    </span>
                </div>

                {/* ── GRID — artık ProductCard kullanıyor ── */}
                <div className="campaignGrid">
                    {loading ? (
                        Array(6).fill(null).map((_, i) => (
                            <div key={i} className="campaignSkeleton" />
                        ))
                    ) : campaignProducts.length === 0 ? (
                        <div className="campaignEmpty">
                            Şu an aktif kampanya bulunmuyor.
                        </div>
                    ) : (
                        campaignProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                addToCart={addToCart}
                                toggleWishlist={toggleWishlist}
                                wishlist={wishlist}
                                user={user}
                            />
                        ))
                    )}
                </div>

            </div>
        </section>
    )
}

export default Campaigns