/* ─── toast.js ────────────────────────────────────────────────
   Kullanım:
     import { showToast } from "../utils/toast"
     showToast("Mesaj", "success" | "error" | "info" | "warning")
──────────────────────────────────────────────────────────────── */

let container = null

function getContainer() {
    if (container) return container
    container = document.createElement("div")
    container.id = "toast-root"
    Object.assign(container.style, {
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: "99999",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        pointerEvents: "none",
    })
    document.body.appendChild(container)
    return container
}

const ICONS = {
    success: "✓",
    error: "✕",
    info: "💙",
    warning: "⚠",
}

const COLORS = {
    success: { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)", text: "#34d399" },
    error: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", text: "#f87171" },
    info: { bg: "rgba(58,169,255,0.15)", border: "rgba(58,169,255,0.4)", text: "#3aa9ff" },
    warning: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)", text: "#fbbf24" },
}

export function showToast(message, type = "info", duration = 3000) {
    const c = getContainer()
    const colors = COLORS[type] || COLORS.info

    const toast = document.createElement("div")
    Object.assign(toast.style, {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 18px",
        borderRadius: "10px",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: "white",
        fontSize: "14px",
        fontFamily: "'DM Sans', sans-serif",
        backdropFilter: "blur(16px)",
        pointerEvents: "auto",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        maxWidth: "320px",
        transform: "translateX(120%)",
        transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.3s",
        opacity: "0",
        cursor: "pointer",
    })

    const icon = document.createElement("span")
    icon.textContent = ICONS[type] || "ℹ"
    Object.assign(icon.style, {
        color: colors.text,
        fontWeight: "700",
        fontSize: "15px",
        flexShrink: "0",
    })

    const text = document.createElement("span")
    text.textContent = message

    toast.appendChild(icon)
    toast.appendChild(text)
    c.appendChild(toast)

    // animate in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.style.transform = "translateX(0)"
            toast.style.opacity = "1"
        })
    })

    // dismiss
    const dismiss = () => {
        toast.style.transform = "translateX(120%)"
        toast.style.opacity = "0"
        setTimeout(() => toast.remove(), 350)
    }

    toast.addEventListener("click", dismiss)
    const timer = setTimeout(dismiss, duration)

    // clear timer if clicked early
    toast.addEventListener("click", () => clearTimeout(timer))
}