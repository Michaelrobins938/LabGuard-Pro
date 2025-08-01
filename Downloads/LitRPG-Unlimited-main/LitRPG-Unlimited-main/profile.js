// profile.js

document.addEventListener('DOMContentLoaded', () => {
    const startProfileCreationBtn = document.getElementById('startProfileCreation');
    const characterCarousel = document.querySelector('.character-carousel');
    const modelSelection = document.querySelector('.model-selection');
    const profilePage = document.getElementById('profilePage');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
    }

    const apiUrl = '/api';

    async function saveProfile(profileData) {
        const response = await fetch(`${apiUrl}/saveProfile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(profileData)
        });
        const result = await response.json();
        console.log(result.message);
    }

    async function loadProfile(username) {
        const response = await fetch(`${apiUrl}/getProfile/${username}`, {
            headers: {
                'Authorization': token
            }
        });
        const profile = await response.json();
        displayProfile(profile);
    }

    function displayProfile(profile) {
        document.getElementById('profileUsername').textContent = profile.username;
        document.getElementById('characterImage').src = profile.characterImage;
        document.getElementById('level').textContent = profile.level;
        document.getElementById('exp').style.width = `${profile.exp}%`;
        document.getElementById('alignment').textContent = profile.alignment;
        document.getElementById('companion').textContent = profile.companion;
        const skillsContainer = document.getElementById('skillsContainer');
        skillsContainer.innerHTML = '';
        profile.skills.forEach(skill => {
            const img = document.createElement('img');
            img.src = skill.image;
            img.alt = skill.name;
            skillsContainer.appendChild(img);
        });
    }

    startProfileCreationBtn.addEventListener('click', () => {
        document.querySelector('.initial-prompt').style.display = 'none';
        characterCarousel.style.display = 'block';
    });

    let currentIndex = 0;
    const images = document.querySelectorAll('.carousel img');

    document.getElementById('prevCharacter').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    document.getElementById('nextCharacter').addEventListener('click', () => {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    document.getElementById('selectCharacter').addEventListener('click', () => {
        const selectedCharacter = images[currentIndex].dataset.character;
        characterCarousel.style.display = 'none';
        showModelSelection(selectedCharacter);
    });

    document.querySelectorAll('.model-option').forEach(model => {
        model.addEventListener('click', () => {
            const selectedModel = model.dataset.model;
            const profileData = {
                username: 'TestUsername95',
                character: selectedCharacter,
                model: selectedModel,
                level: 1,
                exp: 0,
                skills: ['Skill1', 'Skill2'],
                alignment: 'Good',
                companion: 'Infant Tressym'
            };
            saveProfile(profileData);
            loadProfile('TestUsername95');
            modelSelection.style.display = 'none';
            profilePage.style.display = 'flex';
        });
    });

    function updateCarousel() {
        const offset = -currentIndex * 100;
        document.querySelector('.carousel').style.transform = `translateX(${offset}%)`;
        images.forEach((img, index) => {
            img.classList.toggle('selected', index === currentIndex);
        });
    }

    function showModelSelection(character) {
        document.querySelectorAll('.model-option').forEach(model => {
            model.style.display = model.classList.contains(character) ? 'inline-block' : 'none';
        });
        modelSelection.style.display = 'block';
    }

    loadProfile('TestUsername95');
});
