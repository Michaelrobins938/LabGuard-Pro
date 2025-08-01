// script.js
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#navbar ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
        link.addEventListener('mouseenter', () => link.classList.add('hovered'));
        link.addEventListener('mouseleave', () => link.classList.remove('hovered'));
    });

    function smoothScroll(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute('href');
        if (targetId.startsWith('#')) {
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            window.location.href = targetId;
        }
    }

    const testimonials = document.querySelectorAll('.testimonial');
    testimonials.forEach((testimonial, index) => {
        setTimeout(() => {
            testimonial.style.opacity = 1;
            testimonial.style.transform = 'translateY(0)';
        }, index * 200);
    });

    const form = document.getElementById('feedback-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.querySelector('#username').value;
        const testimonialText = document.querySelector('#testimonial').value;
        const rating = document.querySelector('#rating').value;

        const newTestimonial = document.createElement('div');
        newTestimonial.className = 'testimonial';
        newTestimonial.innerHTML = `
            <p>"${testimonialText}"</p>
            <h3>- ${username}</h3>
            <div class="rating" role="img" aria-label="${rating} stars">
                ${Array.from({length: 5}, (_, i) => `<i class="fas fa-star${i < rating ? '' : '-half-alt'}"></i>`).join('')}
            </div>
        `;

        document.querySelector('.testimonials').appendChild(newTestimonial);
        form.reset();
    });
});
