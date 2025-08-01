document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("characterCreationModal");
    const btn = document.getElementById("openCharacterCreation");
    const span = document.getElementsByClassName("close")[0];
    const characterSheets = document.querySelectorAll('.character-sheet');
    const sheetCloseButtons = document.querySelectorAll('.character-sheet-close');

    btn.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Handle form submission
    const characterForm = document.getElementById('characterForm');
    characterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const characterName = document.getElementById('characterName').value;
        const characterClass = document.getElementById('characterClass').value;
        const selectedAvatar = document.querySelector('.avatar-option.selected img').src;

        const newCharacter = {
            name: characterName,
            class: characterClass,
            avatar: selectedAvatar
        };

        localStorage.setItem('character', JSON.stringify(newCharacter));
        alert('Character Created Successfully!');
        modal.style.display = 'none';
        // You can add logic to update the profile page with new character info
    });

    // Handle avatar selection and sheet display
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            const sheetId = this.getAttribute('data-sheet');
            characterSheets.forEach(sheet => sheet.style.display = 'none');
            document.getElementById(sheetId).style.display = 'block';
        });
    });

    // Handle sheet close buttons
    sheetCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sheet = this.parentElement;
            sheet.style.display = 'none';
        });
    });
});
