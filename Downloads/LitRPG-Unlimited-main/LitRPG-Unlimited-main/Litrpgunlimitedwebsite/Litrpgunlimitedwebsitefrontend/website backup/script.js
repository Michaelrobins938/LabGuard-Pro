// script.js

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const links = navbar.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });

    const subscriptionForm = document.getElementById('subscription-form');
    subscriptionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Subscription successful!');
    });

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message sent!');
    });
});
