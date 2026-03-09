import { useEffect } from "react"
import { useLocation } from "react-router-dom"

function ScrollToSection() {

    const location = useLocation()

    useEffect(() => {

        if (location.hash) {

            const el = document.querySelector(location.hash)

            if (el) {

                setTimeout(() => {
                    el.scrollIntoView({ behavior: "smooth" })
                }, 100)

            }

        }

    }, [location])

    return null

}

export default ScrollToSection