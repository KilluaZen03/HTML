console.log("Hello, World!")
alert("Alert")

const userName = document.getElementById("in_username")
const userPassword = document.getElementById("in_password")
const btnLogin = document.getElementById("btn_login")

const login = async () => {
    const user = { username: userName.value, password: userPassword.value }
    const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    })
    const data = await res.json()
    if (data.login === true) {
        sessionStorage.id = data.user.id
        sessionStorage.username = data.user.name
        window.location = "/profile"
    } else {
        alert("Invalid credentials!")
    }
}

btnLogin.addEventListener("click", login)
userPassword.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        login()
    }
})