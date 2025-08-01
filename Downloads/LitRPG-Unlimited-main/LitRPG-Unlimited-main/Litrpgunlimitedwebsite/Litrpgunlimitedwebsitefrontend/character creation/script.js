document.addEventListener('DOMContentLoaded', () => {
    const stageContainer = document.getElementById('stage-container');
    const stageImage = document.getElementById('stage-image');
    const narrativeText = document.getElementById('narrative-text');
    const choicesContainer = document.getElementById('choices-container');
    const summary = document.getElementById('summary');
    const summaryContent = document.getElementById('summary-content');
    const interactionSound = document.getElementById('interaction-sound');

    let currentStage = 0;
    let correctAnswers = 0;
    const stages = [
        {
            image: 'path/to/initial-stage-image.jpg',
            content: 'In your dream, you are falling from the sky into the vast ocean below. Your eyes are closed, and you feel the wind rushing past as you descend slowly. As you approach the ground, the darkness surrounding you begins to shift. The ground beneath your feet transforms into a flurry of birds that take flight, revealing a radiant light that forms a majestic circle around you. This is the beginning of your journey, a place where your deepest fears and desires come to life.',
            choices: []
        },
        {
            image: 'path/to/second-stage-image.jpg',
            content: 'As you gain your bearings, a voice echoes in your mind, asking, "What is it you are so afraid of?" Choose carefully, as your answer will shape your path ahead.',
            choices: [
                { text: 'Getting trapped in the darkness.', nextStage: 2 },
                { text: 'Causing someone to be hurt.', nextStage: 2 },
                { text: 'Losing something that\'s important.', nextStage: 2, isCorrect: true }
            ]
        },
        {
            image: 'path/to/third-stage-image.jpg',
            content: 'The voice continues, "What is the one thing you care about more than anything else?" Your answer will determine the bonds you forge along your journey.',
            choices: [
                { text: 'The hearts connected by light.', nextStage: 3 },
                { text: 'My close friends.', nextStage: 3, isCorrect: true },
                { text: 'The strength to protect others.', nextStage: 3 }
            ]
        },
        {
            image: 'path/to/fourth-stage-image.jpg',
            content: 'Finally, the voice asks, "What do you wish for?" Your answer will reveal your deepest desire and guide your destiny.',
            choices: [
                { text: 'To protect my friends', nextStage: 4 },
                { text: 'To recover something important.', nextStage: 4, isCorrect: true },
                { text: 'To heal the pain from the past.', nextStage: 4 }
            ]
        },
        {
            image: 'path/to/final-stage-image.jpg',
            content: 'You have reached the final stage. A formidable challenge lies ahead. Prepare yourself for the final encounter, where your choices will be put to the ultimate test.',
            choices: [
                { text: 'Begin Final Battle', nextStage: 5 }
            ]
        },
        {
            image: 'path/to/final-boss-image.jpg',
            content: 'A shadowy figure emerges, mirroring your every move. It transforms into a colossal shadow. You must confront and defeat this embodiment of your fears and doubts. Prepare for battle!',
            choices: []
        },
        {
            image: 'path/to/after-battle-image.jpg',
            content: 'Congratulations! You have triumphed over the shadow. Your journey has tested your strength and resolve. Now, answer the final questions to unlock a secret companion who will aid you in your quest.',
            choices: [
                { text: 'Answer Final Questions', nextStage: 7 }
            ]
        },
        {
            image: 'path/to/final-questions-image.jpg',
            content: 'The voice asks one last time, "What is it you are so afraid of?" Choose wisely.',
            choices: [
                { text: 'Getting trapped in the darkness.', nextStage: 8 },
                { text: 'Causing someone to be hurt.', nextStage: 8 },
                { text: 'Losing something that\'s important.', nextStage: 8, isCorrect: true }
            ]
        },
        {
            image: 'path/to/final-questions-image.jpg',
            content: 'The voice continues, "What is the one thing you care about more than anything else?" Your answer will define your bonds.',
            choices: [
                { text: 'The hearts connected by light.', nextStage: 9 },
                { text: 'My close friends.', nextStage: 9, isCorrect: true },
                { text: 'The strength to protect others.', nextStage: 9 }
            ]
        },
        {
            image: 'path/to/final-questions-image.jpg',
            content: 'Finally, the voice asks, "What do you wish?" Your answer will guide your destiny.',
            choices: [
                { text: 'To protect my friends', nextStage: 10 },
                { text: 'To recover something important.', nextStage: 10, isCorrect: true },
                { text: 'To heal the pain from the past.', nextStage: 10 }
            ]
        },
        {
            image: 'path/to/congratulations-image.jpg',
            content: 'Congratulations! You have unlocked a one-of-a-kind companion to begin your quest with. This companion will grow and evolve alongside you, providing invaluable support on your journey.',
            choices: []
        }
    ];

    function updateStage() {
        const stage = stages[currentStage];
        stageImage.src = stage.image;
        typeWriter(stage.content, narrativeText, () => {
            choicesContainer.innerHTML = '';
            stage.choices.forEach(choice => {
                const button = document.createElement('button');
                button.innerText = choice.text;
                button.classList.add('fade-in');
                button.addEventListener('click', () => {
                    currentStage = choice.nextStage;
                    playSound();
                    if (choice.isCorrect) {
                        correctAnswers++;
                    }
                    if (currentStage >= stages.length) {
                        showSummary();
                    } else {
                        updateStage();
                    }
                });
                choicesContainer.appendChild(button);
            });
            choicesContainer.classList.add('fade-in');
        });
    }

    function typeWriter(text, element, callback) {
        let i = 0;
        element.innerHTML = '';
        function typing() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typing, 50);
            } else {
                callback();
            }
        }
        typing();
    }

    function playSound() {
        interactionSound.play();
    }

    function showSummary() {
        stageContainer.style.display = 'none';
        summary.style.display = 'block';
        if (correctAnswers === 3) {
            summaryContent.innerHTML = '<p>Congratulations! You have unlocked a secret companion to begin your quest with.</p>';
        } else {
            summaryContent.innerHTML = '<p>Your character summary goes here.</p>';
        }
    }

    updateStage();
});

function downloadCharacterSheet() {
    const element = document.createElement('a');
    const file = new Blob(['Character Sheet Content'], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'CharacterSheet.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}
