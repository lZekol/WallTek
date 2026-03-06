import { useNavigate } from "react-router-dom"
import "./Login.css"

function Login() {
    const navigate = useNavigate()
    return (

        <section className="loginPage">

            <div className="loginBox">

                <h2>Giriş Yap</h2>

                <input
                    type="email"
                    placeholder="E-posta"
                />

                <input
                    type="password"
                    placeholder="Şifre"
                />

                <button onClick={() => navigate("/")}>
                    Giriş Yap
                </button>

                <p>
                    Hesabın yok mu? <span>Kayıt Ol</span>
                </p>

            </div>

        </section>

    )

}

export default Login