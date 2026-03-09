import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function RefreshToHome() {

    const navigate = useNavigate()

    useEffect(() => {

        navigate("/")

    }, [])

    return null

}

export default RefreshToHome