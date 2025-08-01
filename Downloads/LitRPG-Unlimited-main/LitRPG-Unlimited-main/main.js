document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                // Show the modal
                const modal = document.getElementById('successModal');
                modal.style.display = 'block';
                modal.style.opacity = '1';
            } else {
                alert(`Registration failed: ${result.message}`);
            }
        } catch (error) {
            alert(`An error occurred: ${error.message}`);
        }
    });

    // Close the modal
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeSpan = document.getElementsByClassName('close')[0];

    closeModalBtn.onclick = function() {
        modal.style.opacity = '0';
        setTimeout(() => modal.style.display = 'none', 300);
    };

    closeSpan.onclick = function() {
        modal.style.opacity = '0';
        setTimeout(() => modal.style.display = 'none', 300);
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.style.display = 'none', 300);
        }
    };
});
