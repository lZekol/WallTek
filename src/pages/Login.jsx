import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { supabase } from "../lib/supabase"
import "./Login.css"

function Login() {

    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    /* EMAIL LOGIN */

    const handleLogin = async () => {

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {

            alert(error.message)

        } else {

            navigate("/")

        }

    }


    /* REGISTER */

    const handleRegister = async () => {

        const { error } = await supabase.auth.signUp({
            email,
            password
        })

        if (error) {

            alert(error.message)

        } else {

            alert("Kayıt başarılı! Giriş yapabilirsiniz.")

        }

    }


    /* GOOGLE LOGIN */

    const googleLogin = async () => {

        await supabase.auth.signInWithOAuth({

            provider: "google",

            options: {
                redirectTo: window.location.origin
            }

        })

    }


    /* GUEST LOGIN */

    const guestLogin = () => {

        localStorage.setItem("guest", "true")

        navigate("/")

    }


    return (

        <section className="loginPage">

            <div className="loginBox">

                <h2>Giriş Yap</h2>


                <input
                    type="email"
                    placeholder="E-posta"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />


                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />


                <button onClick={handleLogin}>
                    Giriş Yap
                </button>


                <button onClick={handleRegister} className="registerBtn">
                    Kayıt Ol
                </button>


                <div className="loginDivider">
                    veya
                </div>


                <button onClick={googleLogin} className="googleBtn">
                    Google ile Giriş Yap
                </button>


                <button onClick={guestLogin} className="guestBtn">
                    Misafir Olarak Devam Et
                </button>


            </div>

        </section>

    )

}

export default Login