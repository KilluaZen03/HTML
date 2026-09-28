window.onload = async () => {
    if(sessionStorage.id) {
        const res = await fetch(`http://localhost:4000/users/${sessionStorage.id}`)
        const data = await res.json()
        document.getElementById('id').textContent = data.id
        document.getElementById('name').textContent = data.name
        document.getElementById('edad').textContent = data.edad
        document.getElementById('points').textContent = data.points
        document.getElementById('username').textContent = data.username
        document.getElementById('password').textContent = data.password


    }else{
        window.location = "../"
    }


};

const username = document.getElementById('username')
    
username.innerText = sessionStorage.username