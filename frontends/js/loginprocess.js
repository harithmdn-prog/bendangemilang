const adminLoginForm = document.getElementById('adminLoginForm')

adminLoginForm.addEventListener('submit', async (e) => {

    e.preventDefault()


    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    try {

        const response = await fetch('http://localhost:5000/api/login', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })

        if (!response.ok) {
            throw new Error('Login failed')
        }

        localStorage.setItem('adminLoggedIn', 'true')

        alert('Login successful')

        window.location.href = 'admin.html'

    } catch (error) {
        console.error('Login error:', error)
        alert('Login failed')
    }
})