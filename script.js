console.log("Hello, World!")
alert("Alert")

const userName = document.getElementById("in_username")
const userPassword = document.getElementById("in_password")
const btnLogin = document.getElementById("btn_login")

const login = () => {
    //alert(userName.value+" "+userPassword.value)}
    if (userName.value === "admin" && userPassword.value === "olivas") {
        sessionStorage.setItem("username", userName.value)
        localStorage.setItem("password", userPassword.value)
        window.location.href = "profile.html"
    } else {
        alert("Invalid credentials!")
    }
}

btnLogin.addEventListener("click", login)