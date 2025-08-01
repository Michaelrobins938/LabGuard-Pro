document.addEventListener('DOMContentLoaded', (event) => {
    const stageContainer = document.getElementById('stage-container');
    const stageImage = document.getElementById('stage-image');
    const stageContent = document.getElementById('stage-content');
    const dieRollContainer = document.getElementById('die-roll');
    const dieResult = document.getElementById('die-result');
    const summaryContainer = document.getElementById('summary');
    const summaryContent = document.getElementById('summary-content');
    const diceSelect = document.getElementById('dice-select');
    const backgroundMusic = document.getElementById('background-music');

    const questions = [
        {
            question: "What drives your character’s pursuit of magic?",
            image: "static/path/to/image1.png",
            choices: ["Knowledge", "Power", "Protection"],
            outcomes: {
                "Knowledge": {
                    d4: ["Basic Knowledge", "Moderate Knowledge", "High Knowledge", "Peak Knowledge"]
                },
                "Power": {
                    d4: ["Basic Strength", "Moderate Strength", "High Strength", "Peak Strength"]
                },
                "Protection": {
                    d4: ["Basic Defense", "Moderate Defense", "High Defense", "Peak Defense"]
                }
            }
        },
        {
            question: "What is your character’s greatest fear?",
            image: "static/path/to/image2.png",
            choices: ["Fear of the Unknown", "Fear of Failure", "Fear of Loss", "Fear of Betrayal"],
            outcomes: {
                "Fear of the Unknown": {
                    d4: ["Minor Anxiety", "Moderate Anxiety", "High Anxiety", "Severe Anxiety"]
                }
            }
        },
        {
            question: "What is your character’s greatest virtue?",
            image: "static/path/to/image3.png",
            choices: ["Compassion", "Honor", "Wisdom", "Courage"],
            outcomes: {
                "Compassion": {
                    d4: ["Minor Empathy", "Moderate Empathy", "High Empathy", "Peak Empathy"]
                }
            }
        }
    ];

    const stages = [
        {
            image: "static/path/to/stage1_image.png",
            content: `
                <p>Walk forward to begin your journey...</p>
                <button onclick="nextStage()">Proceed</button>
            `
        },
        {
            image: "static/path/to/stage2_image.png",
            content: `
                <p>Choose your path:</p>
                <button onclick="selectChoice('Dream Sword')">Dream Sword</button>
                <button onclick="selectChoice('Dream Shield')">Dream Shield</button>
                <button onclick="selectChoice('Dream Rod')">Dream Rod</button>
                <br><p>Discard one:</p>
                <button onclick="discardChoice('Dream Sword')">Discard Sword</button>
                <button onclick="discardChoice('Dream Shield')">Discard Shield</button>
                <button onclick="discardChoice('Dream Rod')">Discard Rod</button>
            `
        }
    ];

    let currentStageIndex = 0;
    let currentQuestionIndex = 0;
    let quizSummary = [];
    let characterStats = {
        health: 100,
        attack_power: 10,
        defense: 5,
        intelligence: 0,
        strength: 0,
        agility: 0,
        charisma: 0,
        willpower: 0,
        mental_health: 0,
        starting_items: [],
        artifact: "",
        companion: ""
    };

    function showStage() {
        if (currentStageIndex < stages.length) {
            const stageObj = stages[currentStageIndex];
            stageImage.src = stageObj.image;
            stageContent.innerHTML = stageObj.content;
        } else {
            showQuestion();
        }
    }

    function showQuestion() {
        if (currentQuestionIndex < questions.length) {
            const questionObj = questions[currentQuestionIndex];
            let questionHTML = `<img src="${questionObj.image}" alt="Question Image" class="quiz-image"><p>${questionObj.question}</p>`;
            questionObj.choices.forEach((choice) => {
                questionHTML += `<button onclick="selectChoice('${choice}')">${choice}</button><br>`;
            });
            stageContent.innerHTML = questionHTML;
        } else {
            showFinalChoices();
        }
    }

    window.nextStage = function() {
        currentStageIndex++;
        showStage();
    }

    window.selectChoice = function(choice) {
        dieRollContainer.style.display = 'block';
        dieRollContainer.dataset.choice = choice;
    }

    window.rollDie = function() {
        const dieType = diceSelect.value;
        const maxRoll = parseInt(dieType.slice(1));
        const roll = Math.floor(Math.random() * maxRoll) + 1;
        const choice = dieRollContainer.dataset.choice;
        const question = questions[currentQuestionIndex];
        const outcome = question.outcomes[choice][dieType][roll - 1];
        dieResult.textContent = `You rolled a ${roll}: ${outcome}`;
        quizSummary.push({ question: question.question, choice, roll, outcome });

        updateCharacterStats(choice, roll, outcome);

        dieRollContainer.style.display = 'none';
        currentQuestionIndex++;
        showQuestion();
    }

    function updateCharacterStats(choice, roll, outcome) {
        if (choice.includes("Knowledge")) {
            characterStats.intelligence += roll;
        } else if (choice.includes("Power")) {
            characterStats.strength += roll;
        } else if (choice.includes("Protection")) {
            characterStats.willpower += roll;
        } else if (choice.includes("Fear")) {
            characterStats.mental_health -= roll;
        } else if (choice.includes("Virtue")) {
            characterStats.charisma += roll;
        }
    }

    function showFinalChoices() {
        const finalChoiceOptions = determineFinalChoices();
        let finalChoicesHTML = `<h2>Choose Your Artifact</h2>`;
        finalChoiceOptions.artifacts.forEach((artifact) => {
            finalChoicesHTML += `<button onclick="selectFinalChoice('artifact', '${artifact}')">${artifact}</button><br>`;
        });
        finalChoicesHTML += `<h2>Choose Your Companion</h2>`;
        finalChoiceOptions.companions.forEach((companion) => {
            finalChoicesHTML += `<button onclick="selectFinalChoice('companion', '${companion}')">${companion}</button><br>`;
        });
        stageContent.innerHTML = finalChoicesHTML;
    }

    function determineFinalChoices() {
        const artifactOptions = ["Mystic Wand of Arcane Wonders", "Enchanted Amulet of Infinite Possibilities", "Cursed Tome of Eldritch Secrets", "Divine Staff of Celestial Power"];
        const companionOptions = ["Phoenix of Eternal Flame", "Dragon of Infinite Wisdom", "Unicorn of Boundless Grace", "Griffin of Unyielding Strength"];

        if (characterStats.intelligence > characterStats.strength) {
            artifactOptions.splice(0, 1);
        } else {
            artifactOptions.splice(2, 1);
        }

        if (characterStats.willpower > characterStats.charisma) {
            companionOptions.splice(0, 1);
        } else {
            companionOptions.splice(2, 1);
        }

        return { artifacts: artifactOptions, companions: companionOptions };
    }

    window.selectFinalChoice = function(type, choice) {
        if (type === 'artifact') {
            characterStats.artifact = choice;
        } else if (type === 'companion') {
            characterStats.companion = choice;
        }

        if (characterStats.artifact && characterStats.companion) {
            showSummary();
        }
    }

    function showSummary() {
        let summaryHTML = '';
        quizSummary.forEach(entry => {
            summaryHTML += `<p>${entry.question}<br>Choice: ${entry.choice}<br>Roll: ${entry.roll}<br>Outcome: ${entry.outcome}</p>`;
        });
        summaryHTML += `<h3>Character Stats:</h3>`;
        summaryHTML += `<p>Health: ${characterStats.health}</p>`;
        summaryHTML += `<p>Attack Power: ${characterStats.attack_power}</p>`;
        summaryHTML += `<p>Defense: ${characterStats.defense}</p>`;
        summaryHTML += `<p>Artifact: ${characterStats.artifact}</p>`;
        summaryHTML += `<p>Companion: ${characterStats.companion}</p>`;

        summaryContent.innerHTML = summaryHTML;
        summaryContainer.style.display = 'block';
    }

    window.startBattle = function() {
        fetch('/start_battle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ character_stats: characterStats }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.result);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    showStage();
    backgroundMusic.play();
});
