document.getElementById('reset-password-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = document.getElementById('password').value;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // Ensure you're passing a reset token

    try {
        const response = await fetch(`/reset-password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });

        const result = await response.json();
        if (result.success) {
            alert('Password reset successfully');
            window.location.href = '/login.html';
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Error, please try again later.');
    }
});
