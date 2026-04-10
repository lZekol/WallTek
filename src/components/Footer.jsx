import { Link, useNavigate } from "react-router-dom"
import "./Footer.css"

const CATEGORIES = [
    { label: "GPU", path: "/category/gpu" },
    { label: "Laptop", path: "/category/laptop" },
    { label: "Monitör", path: "/category/monitor" },
    { label: "Kulaklık", path: "/category/headset" },
    { label: "Mouse", path: "/category/mouse" },
    { label: "Klavye", path: "/category/keyboard" },
    { label: "Televizyon", path: "/category/tv" },
]

const LINKS = [
    { label: "Anasayfa", path: "/" },
    { label: "Kampanyalar", path: "/campaigns" },
    { label: "Siparişlerim", path: "/orders" },
    { label: "Favorilerim", path: "/wishlist" },
    { label: "Hesabım", path: "/profile" },
]

const SOCIAL = [
    {
        label: "Instagram",
        href: "#",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
        )
    },
    {
        label: "Twitter / X",
        href: "#",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        )
    },
    {
        label: "YouTube",
        href: "#",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        )
    },
]

function Footer() {
    const navigate = useNavigate()

    return (
        <footer className="footer">
            <div className="footerInner">

                {/* brand */}
                <div className="footerBrand">
                    <div className="footerLogo" onClick={() => navigate("/")}>WallTek</div>
                    <p className="footerTagline">
                        Gaming ve teknoloji dünyasının en iyi ürünleri tek bir yerde.
                    </p>
                    <div className="footerSocial">
                        {SOCIAL.map(s => (
                            <a key={s.label} href={s.href} className="footerSocialBtn"
                                aria-label={s.label} target="_blank" rel="noopener noreferrer">
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* categories */}
                <div className="footerCol">
                    <h4>Kategoriler</h4>
                    <ul>
                        {CATEGORIES.map(c => (
                            <li key={c.path}>
                                <Link to={c.path}>{c.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* links */}
                <div className="footerCol">
                    <h4>Hesap & Sayfalar</h4>
                    <ul>
                        {LINKS.map(l => (
                            <li key={l.path}>
                                <Link to={l.path}>{l.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* contact */}
                <div className="footerCol">
                    <h4>İletişim</h4>
                    <ul className="footerContact">
                        <li>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            <span>destek@walltek.com</span>
                        </li>
                        <li>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <span>0850 000 00 00</span>
                        </li>
                        <li>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>Pzt–Cmt 09:00–22:00</span>
                        </li>
                    </ul>

                    {/* güven rozetleri */}
                    <div className="footerBadges">
                        <span className="footerBadge">🔒 SSL Güvenli</span>
                        <span className="footerBadge">↩ 14 Gün İade</span>
                        <span className="footerBadge">🚚 Ücretsiz Kargo</span>
                    </div>
                </div>

            </div>

            {/* bottom bar */}
            <div className="footerBottom">
                <span>© {new Date().getFullYear()} WallTek. Tüm hakları saklıdır.</span>
                <div className="footerBottomLinks">
                    <a href="#">Gizlilik Politikası</a>
                    <a href="#">Kullanım Koşulları</a>
                    <a href="#">Çerez Politikası</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer