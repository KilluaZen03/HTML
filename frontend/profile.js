const API_URL = "http://localhost:4000"

window.onload = async () => {
    const id = sessionStorage.getItem("id")
    if (!id) {
        window.location = "index.html"
        return
    }
    try {
        const res = await fetch(`${API_URL}/users/${id}`)
        if (!res.ok) throw new Error("Usuario no encontrado")
        const data = await res.json()
        document.getElementById("id").textContent = data.id
        document.getElementById("name").textContent = data.name
        document.getElementById("email").textContent = data.email
    } catch (error) {
        alert("No se pudo cargar el perfil")
    }
}

document.getElementById("btn_logout").addEventListener("click", () => {
    sessionStorage.clear()
    window.location = "index.html"
})
