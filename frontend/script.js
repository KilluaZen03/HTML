const API_URL = "http://localhost:4000"

const userEmail = document.getElementById("in_email")
const userPassword = document.getElementById("in_password")
const btnLogin = document.getElementById("btn_login")

const login = async () => {
    const user = { email: userEmail.value, password: userPassword.value }
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        })
        const data = await res.json()
        if (data.login === true) {
            sessionStorage.setItem("id", data.user.id)
            sessionStorage.setItem("username", data.user.name)
            window.location = "profile.html"
        } else {
            alert("Credenciales inválidas")
        }
    } catch (error) {
        alert("No se pudo conectar con el servidor")
    }
}

btnLogin.addEventListener("click", login)
userPassword.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        login()
    }
})
