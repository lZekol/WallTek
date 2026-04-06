import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import { supabase } from "../lib/supabase"
import "./Login.css"

const IconMail = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
)
const IconLock = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
)
const IconEye = ({ open }) => open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
    </svg>
) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
    </svg>
)
const IconWarn = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
)



/* şifre gücü hesapla */
function getPasswordStrength(pw) {
    if (!pw) return { score: 0, label: "", color: "" }
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    const map = [
        { label: "", color: "" },
        { label: "Zayıf", color: "#ff4d4d" },
        { label: "Orta", color: "#f59e0b" },
        { label: "İyi", color: "#3aa9ff" },
        { label: "Güçlü", color: "#34d399" },
    ]
    return { score, ...map[score] }
}

/* Supabase hata mesajlarını Türkçeye çevir */
function translateError(msg) {
    if (!msg) return "Bir hata oluştu"
    if (msg.includes("Invalid login credentials")) return "E-posta veya şifre hatalı"
    if (msg.includes("Email not confirmed")) return "E-posta adresin onaylanmamış. Lütfen gelen kutunu kontrol et."
    if (msg.includes("User already registered")) return "Bu e-posta zaten kayıtlı. Giriş yapmayı dene."
    if (msg.includes("Password should be at least")) return "Şifre en az 6 karakter olmalı"
    if (msg.includes("Unable to validate email")) return "Geçersiz e-posta adresi"
    if (msg.includes("rate limit")) return "Çok fazla deneme. Lütfen biraz bekle."
    return msg
}

function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from || "/"

    const guestDestination = ["/wishlist", "/profile", "/orders", "/checkout"].includes(from) ? "/" : from

    const [mode, setMode] = useState("login") // "login" | "register" | "forgot"
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")

    const pwStrength = getPasswordStrength(password)

    const validate = () => {
        const errs = {}
        if (!email.trim()) errs.email = "E-posta adresi gerekli"
        else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Geçerli bir e-posta girin"
        if (mode !== "forgot") {
            if (!password) errs.password = "Şifre gerekli"
            else if (password.length < 6) errs.password = "Şifre en az 6 karakter olmalı"
        }
        return errs
    }


    /* ── GİRİŞ ── */
    const handleLogin = async () => {
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        setLoading(false)
        if (error) setErrors({ general: translateError(error.message) })
        else navigate(from)
    }

    /* ── KAYIT — gerçek email onayı ── */
    const handleRegister = async () => {
        const errs = validate()
        if (Object.keys(errs).length) { setErrors(errs); return }
        setLoading(true)
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                /* Supabase, doğrulama mailini otomatik gönderir */
                emailRedirectTo: `${window.location.origin}/login`,
            }
        })
        setLoading(false)

        if (error) {
            setErrors({ general: translateError(error.message) })
            return
        }

        /* identities boşsa kullanıcı zaten var */
        if (data.user && data.user.identities?.length === 0) {
            setErrors({ general: "Bu e-posta zaten kayıtlı. Giriş yapmayı dene." })
            return
        }

        setSuccessMsg("Kayıt başarılı! " + email + " adresine bir onay maili gönderdik. Mailine tıkladıktan sonra giriş yapabilirsin.")
        setPassword("")
    }

    /* ── ŞİFRE SIFIRLA ── */
    const handleForgot = async () => {
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: "Geçerli bir e-posta girin" }); return
        }
        setLoading(true)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })
        setLoading(false)
        if (error) setErrors({ general: translateError(error.message) })
        else setSuccessMsg("Şifre sıfırlama linki " + email + " adresine gönderildi.")
    }

    /* ── GOOGLE ── */
    const googleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.origin }
        })
    }

    const clearError = (field) => setErrors(p => { const e = { ...p }; delete e[field]; return e })

    const handleSubmit = () => {
        if (mode === "login") handleLogin()
        if (mode === "register") handleRegister()
        if (mode === "forgot") handleForgot()
    }

    return (
        <section className="loginPage">
            <div className="loginBox">

                {/* logo */}
                <div className="loginHeader">
                    <div className="loginLogoMark">W</div>
                    <h2>
                        {mode === "login" && "Giriş Yap"}
                        {mode === "register" && "Kayıt Ol"}
                        {mode === "forgot" && "Şifremi Unuttum"}
                    </h2>
                    <p className="loginSubtitle">
                        {mode === "login" && "WallTek hesabınıza devam edin"}
                        {mode === "register" && "Yeni hesap oluştur"}
                        {mode === "forgot" && "Sıfırlama linki gönderelim"}
                    </p>
                </div>

                {/* başarı mesajı */}
                {successMsg && (
                    <div className="loginSuccess">
                        <span>✓</span> {successMsg}
                    </div>
                )}

                {/* genel hata */}
                {errors.general && (
                    <div className="fieldError" style={{ justifyContent: "center", fontSize: 13 }}>
                        <IconWarn /> {errors.general}
                    </div>
                )}

                {/* inputs */}
                {!successMsg && (
                    <div className="inputGroup">

                        {/* email */}
                        <div className="inputWrapper">
                            <div className="inputIconWrap">
                                <span className="inputIcon"><IconMail /></span>
                                <input
                                    type="email"
                                    placeholder="E-posta"
                                    value={email}
                                    className={errors.email ? "inputError" : email ? "inputSuccess" : ""}
                                    onChange={e => { setEmail(e.target.value); clearError("email") }}
                                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                />
                            </div>
                            {errors.email && <span className="fieldError"><IconWarn /> {errors.email}</span>}
                        </div>

                        {/* şifre (forgot modunda gösterme) */}
                        {mode !== "forgot" && (
                            <div className="inputWrapper">
                                <div className="inputIconWrap">
                                    <span className="inputIcon"><IconLock /></span>
                                    <input
                                        type={showPass ? "text" : "password"}
                                        placeholder="Şifre"
                                        value={password}
                                        className={errors.password ? "inputError" : ""}
                                        onChange={e => { setPassword(e.target.value); clearError("password") }}
                                        onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                        style={{ paddingRight: 40 }}
                                    />
                                    <button
                                        className="eyeBtn"
                                        onClick={() => setShowPass(p => !p)}
                                        type="button"
                                        tabIndex={-1}
                                    >
                                        <IconEye open={showPass} />
                                    </button>
                                </div>
                                {errors.password && <span className="fieldError"><IconWarn /> {errors.password}</span>}

                                {/* şifre gücü — sadece kayıt modunda */}
                                {mode === "register" && password && (
                                    <div className="pwStrength">
                                        <div className="pwStrengthBars">
                                            {[1, 2, 3, 4].map(n => (
                                                <div
                                                    key={n}
                                                    className="pwStrengthBar"
                                                    style={{ background: n <= pwStrength.score ? pwStrength.color : "rgba(255,255,255,0.1)" }}
                                                />
                                            ))}
                                        </div>
                                        <span style={{ color: pwStrength.color, fontSize: 11 }}>{pwStrength.label}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* forgot link — sadece login modunda */}
                {mode === "login" && !successMsg && (
                    <div className="forgotRow">
                        <button className="forgotLink" onClick={() => { setMode("forgot"); setErrors({}) }}>
                            Şifremi unuttum
                        </button>
                    </div>
                )}

                {/* ana buton */}
                {!successMsg && (
                    <button
                        className={`loginBtn${loading ? " loading" : ""}`}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Lütfen bekle…" :
                            mode === "login" ? "Giriş Yap" :
                                mode === "register" ? "Kayıt Ol" :
                                    "Sıfırlama Maili Gönder"}
                    </button>
                )}

                {/* mode switch */}
                {!successMsg && (
                    <div className="modeSwitchRow">
                        {mode === "login" && (
                            <>
                                <span>Hesabın yok mu?</span>
                                <button className="modeSwitchBtn" onClick={() => { setMode("register"); setErrors({}) }}>
                                    Kayıt Ol →
                                </button>
                            </>
                        )}
                        {mode === "register" && (
                            <>
                                <span>Zaten üye misin?</span>
                                <button className="modeSwitchBtn" onClick={() => { setMode("login"); setErrors({}) }}>
                                    Giriş Yap →
                                </button>
                            </>
                        )}

                    </div>
                )}

                {successMsg && mode !== "forgot" && (
                    <button className="loginBtn" onClick={() => { setMode("login"); setSuccessMsg("") }}>
                        Giriş Yap
                    </button>
                )}

                {/* divider + sosyal */}
                {mode !== "forgot" && !successMsg && (
                    <>
                        <div className="loginDivider">veya</div>
                        <button onClick={googleLogin} className="googleBtn">
                            <span className="googleGlyph">G</span>
                            Google ile {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
                        </button>
                        <button onClick={() => { localStorage.setItem("guest", "true"); navigate(guestDestination) }} className="guestBtn">
                            Misafir olarak devam et →
                        </button>
                    </>
                )}

            </div>
        </section>
    )
}

export default Login