document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    try {
        const response = await fetch('https://tatlisite.onrender.com/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        const result = await response.json();
        if (!response.ok) {
            errorMessage.innerHTML = result.message;
            errorMessage.style.display = 'block';
        } else {
            errorMessage.style.display = 'none';
            alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
            window.location.href = '/login.html';
        }
    } catch (error) {
        errorMessage.innerHTML = 'Bir hata oluştu. Lütfen tekrar deneyin.';
        errorMessage.style.display = 'block';
    }
});