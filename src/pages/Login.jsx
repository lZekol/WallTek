import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { supabase } from "../lib/supabase"
import "./Login.css"

/* ── tiny inline SVG icons (no extra dep needed) ── */
const IconMail = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
)

const IconLock = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
)

const IconWarn = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
)

function Login() {

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from || "/"

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    /* ── client-side validation ── */
    const validate = () => {
        const errs = {}
        if (!email.trim()) errs.email = "E-posta adresi gerekli"
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Geçerli bir e-posta girin"
        if (!password) errs.password = "Şifre gerekli"
        else if (password.length < 6) errs.password = "Şifre en az 6 karakter olmalı"
        return errs
    }

    /* ── email login ── */
    const handleLogin = async () => {
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }

        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        setLoading(false)

        if (error) {
            setErrors({ general: "E-posta veya şifre hatalı." })
        } else {
            navigate(from)
        }
    }

    /* ── register ── */
    const handleRegister = async () => {
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }

        setLoading(true)
        const { error } = await supabase.auth.signUp({ email, password })
        setLoading(false)

        if (error) {
            setErrors({ general: error.message })
        } else {
            setErrors({ success: "Kayıt başarılı! Giriş yapabilirsiniz." })
        }
    }

    /* ── google login ── */
    const googleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.origin }
        })
    }

    /* ── guest login ── */
    const guestLogin = () => {
        localStorage.setItem("guest", "true")
        navigate(from)
    }

    const clearError = (field) =>
        setErrors(prev => { const e = { ...prev }; delete e[field]; return e })

    return (
        <section className="loginPage">
            <div className="loginBox">

                {/* header */}
                <div className="loginHeader">
                    <div className="loginLogoMark">W</div>
                    <h2>Giriş Yap</h2>
                    <p className="loginSubtitle">WallTek hesabınıza devam edin</p>
                </div>

                {/* general error / success banner */}
                {errors.general && (
                    <div className="fieldError" style={{ justifyContent: "center", fontSize: 13 }}>
                        <IconWarn /> {errors.general}
                    </div>
                )}
                {errors.success && (
                    <div className="fieldError" style={{ color: "#34d399", justifyContent: "center", fontSize: 13 }}>
                        ✓ {errors.success}
                    </div>
                )}

                {/* inputs */}
                <div className="inputGroup">

                    <div className="inputWrapper">
                        <div className="inputIconWrap">
                            <span className="inputIcon"><IconMail /></span>
                            <input
                                type="email"
                                placeholder="E-posta"
                                value={email}
                                className={errors.email ? "inputError" : email ? "inputSuccess" : ""}
                                onChange={(e) => { setEmail(e.target.value); clearError("email") }}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            />
                        </div>
                        {errors.email && (
                            <span className="fieldError"><IconWarn /> {errors.email}</span>
                        )}
                    </div>

                    <div className="inputWrapper">
                        <div className="inputIconWrap">
                            <span className="inputIcon"><IconLock /></span>
                            <input
                                type="password"
                                placeholder="Şifre"
                                value={password}
                                className={errors.password ? "inputError" : ""}
                                onChange={(e) => { setPassword(e.target.value); clearError("password") }}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            />
                        </div>
                        {errors.password && (
                            <span className="fieldError"><IconWarn /> {errors.password}</span>
                        )}
                    </div>

                </div>

                {/* forgot password */}
                <div className="forgotRow">
                    <button className="forgotLink">Şifremi unuttum</button>
                </div>

                {/* action buttons */}
                <button
                    className={`loginBtn${loading ? " loading" : ""}`}
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
                </button>

                <button className="registerBtn" onClick={handleRegister} disabled={loading}>
                    Kayıt Ol
                </button>

                <div className="loginDivider">veya</div>

                {/* social */}
                <button onClick={googleLogin} className="googleBtn">
                    <span className="googleGlyph">G</span>
                    Google ile Giriş Yap
                </button>

                {/* guest */}
                <button onClick={guestLogin} className="guestBtn">
                    Misafir olarak devam et →
                </button>

            </div>
        </section>
    )
}

export default Login