document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Please fill in both fields.');
            return;
        }

        // Simulate a login process
        if (email === 'test@example.com' && password === 'password') {
            alert('Login successful!');
            // Redirect to another page or perform other actions upon successful login
            window.location.href = 'profile.html';
        } else {
            alert('Invalid email or password.');
        }
    });
});
