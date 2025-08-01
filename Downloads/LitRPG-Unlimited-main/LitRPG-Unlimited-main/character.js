document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const startProfileCreationBtn = document.getElementById('startProfileCreation');
    const initialPrompt = document.querySelector('.initial-prompt');
    const characterCarousel = document.querySelector('.character-carousel');
    const carousel = document.querySelector('.carousel');
    const prevCharacterBtn = document.getElementById('prevCharacter');
    const nextCharacterBtn = document.getElementById('nextCharacter');
    const selectCharacterBtn = document.getElementById('selectCharacter');
    const characterSheet = document.querySelector('.character-sheet');
    const closeSheetBtn = document.querySelector('.close-sheet');
    const confirmCharacterSelectionBtn = document.getElementById('confirmCharacterSelection');
    const profilePage = document.getElementById('profilePage');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileUsername = document.getElementById('profileUsername');
    const characterImage = document.getElementById('characterImage');

    // Carousel variables
    let currentIndex = 0;
    const characters = [
        {
            name: 'Lunar Knight',
            image: 'https://lh3.googleusercontent.com/pw/AP1GczN0Jwjzsm6piEBS82pbiaHienYVYNvjTKAT5LbNRCtc7AHmsAOlA19hCDJxG0kbUF9GUJFdslubDjfTu8t4Brb9BaistvG9s2OQHw2UHKgvZXXCKbKY=w600-h315-p-k'
        },
        {
            name: 'Kitsune',
            image: 'https://lh3.googleusercontent.com/pw/AP1GczMzP1iSTHEP-_0VxkZ-_2cAG_rReo0JJwwdGbX0eQqDxxwOW93K7_eUE8a6eBOfiaT2DRXGCRsO5OraIiXub7U-s6LxUAZSVOzTns2dRfUaUpaR5Xu4=w600-h315-p-k'
        },
        {
            name: 'Luminian',
            image: 'https://lh3.googleusercontent.com/pw/AP1GczPhB9upXI_jhe_PKokqb1kvK_p5jvMbhQLazOWb_7iNeDpftc5NYXldJljf3OVaLRUTa2jKj89GTPGdDb0KBt7O2_rfiktBmRjiP_RySVfW92se8HEc=w600-h315-p-k'
        },
        {
            name: 'Necromancer',
            image: 'https://lh3.googleusercontent.com/pw/AP1GczOo9maIhiLzKtcAgNtcqnO3R_doK5_WFBH2J0vTrMdXtjNgXrMqV2XzG5-2jLCfPF7FDgtTBTDH5tFHxWir8rvn7q_VxHocj9xBxPazFbRFytS9bP5t=w600-h315-p-k'
        }
    ];

    // Initialize character carousel
    function updateCarousel() {
        const angle = 360 / characters.length;
        carousel.style.transform = `rotateY(${-currentIndex * angle}deg)`;
        carousel.querySelectorAll('img').forEach((img, index) => {
            img.style.transform = `rotateY(${index * angle}deg) translateZ(300px)`;
        });
    }

    // Show the character selection screen
    function startProfileCreation() {
        initialPrompt.style.display = 'none';
        characterCarousel.style.display = 'block';
        updateCarousel();
    }

    // Navigate to the previous character
    function prevCharacter() {
        currentIndex = (currentIndex - 1 + characters.length) % characters.length;
        updateCarousel();
    }

    // Navigate to the next character
    function nextCharacter() {
        currentIndex = (currentIndex + 1) % characters.length;
        updateCarousel();
    }

    // Select the current character
    function selectCharacter() {
        characterCarousel.style.display = 'none';
        characterSheet.style.display = 'block';
        document.getElementById('characterSheetImage').src = characters[currentIndex].image;
    }

    // Confirm the character selection
    function confirmCharacterSelection() {
        characterSheet.style.display = 'none';
        profilePage.style.display = 'flex';
        profileAvatar.src = characters[currentIndex].image;
        profileUsername.textContent = characters[currentIndex].name;
        characterImage.src = characters[currentIndex].image;
    }

    // Close character sheet and return to carousel
    function closeCharacterSheet() {
        characterSheet.style.display = 'none';
        characterCarousel.style.display = 'block';
    }

    // Event listeners
    startProfileCreationBtn.addEventListener('click', startProfileCreation);
    prevCharacterBtn.addEventListener('click', prevCharacter);
    nextCharacterBtn.addEventListener('click', nextCharacter);
    selectCharacterBtn.addEventListener('click', selectCharacter);
    closeSheetBtn.addEventListener('click', closeCharacterSheet);
    confirmCharacterSelectionBtn.addEventListener('click', confirmCharacterSelection);
});
