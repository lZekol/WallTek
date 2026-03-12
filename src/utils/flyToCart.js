export function flyToCart(imgElement, cartElement) {

    if (!imgElement || !cartElement) return

    const imgRect = imgElement.getBoundingClientRect()
    const cartRect = cartElement.getBoundingClientRect()

    const flyingImg = imgElement.cloneNode(true)

    flyingImg.style.position = "fixed"
    flyingImg.style.left = imgRect.left + "px"
    flyingImg.style.top = imgRect.top + "px"
    flyingImg.style.width = imgRect.width + "px"
    flyingImg.style.height = imgRect.height + "px"

    flyingImg.style.transition = "all 0.7s cubic-bezier(.65,-0.25,.25,1.25)"
    flyingImg.style.zIndex = "9999"
    flyingImg.style.pointerEvents = "none"

    document.body.appendChild(flyingImg)

    requestAnimationFrame(() => {

        flyingImg.style.left = cartRect.left + "px"
        flyingImg.style.top = cartRect.top + "px"

        flyingImg.style.width = "30px"
        flyingImg.style.height = "30px"

        flyingImg.style.opacity = "0.3"
        flyingImg.style.transform = "scale(0.3)"

    })

    setTimeout(() => {

        flyingImg.remove()

    }, 700)

}