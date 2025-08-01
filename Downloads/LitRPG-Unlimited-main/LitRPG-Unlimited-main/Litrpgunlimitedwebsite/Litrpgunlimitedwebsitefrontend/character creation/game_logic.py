const questions = [
    {
        question: "What drives your character’s pursuit of magic?",
        image: "path/to/image1.png",
        choices: ["Knowledge", "Power", "Protection"],
        outcomes: {
            "Knowledge": {
                d4: ["Basic Knowledge", "Moderate Knowledge", "High Knowledge", "Peak Knowledge"],
                d6: ["Common Knowledge", "Uncommon Knowledge", "Rare Knowledge", "Epic Knowledge", "Legendary Knowledge", "Mythic Knowledge"],
                d8: ["Basic Knowledge", "Moderate Knowledge", "High Knowledge", "Peak Knowledge", "Ultimate Knowledge", "Divine Knowledge", "Celestial Knowledge", "Eternal Knowledge"],
                d10: ["Basic Knowledge", "Moderate Knowledge", "High Knowledge", "Peak Knowledge", "Ultimate Knowledge", "Divine Knowledge", "Celestial Knowledge", "Eternal Knowledge", "Omniscient Knowledge", "Infinite Knowledge"],
                d12: ["Basic Knowledge", "Moderate Knowledge", "High Knowledge", "Peak Knowledge", "Ultimate Knowledge", "Divine Knowledge", "Celestial Knowledge", "Eternal Knowledge", "Omniscient Knowledge", "Infinite Knowledge", "Supreme Knowledge", "Ultimate Wisdom"],
                d20: ["Basic Knowledge", "Moderate Knowledge", "High Knowledge", "Peak Knowledge", "Ultimate Knowledge", "Divine Knowledge", "Celestial Knowledge", "Eternal Knowledge", "Omniscient Knowledge", "Infinite Knowledge", "Supreme Knowledge", "Ultimate Wisdom", "Absolute Wisdom", "Total Wisdom", "Boundless Wisdom", "Endless Wisdom", "All-Encompassing Wisdom", "Transcendent Wisdom", "Incomprehensible Wisdom", "Ultimate Reality"],
                d100: ["Basic Knowledge", "Moderate Knowledge", "High Knowledge", "Peak Knowledge", "Ultimate Knowledge", "Divine Knowledge", "Celestial Knowledge", "Eternal Knowledge", "Omniscient Knowledge", "Infinite Knowledge", "Supreme Knowledge", "Ultimate Wisdom", "Absolute Wisdom", "Total Wisdom", "Boundless Wisdom", "Endless Wisdom", "All-Encompassing Wisdom", "Transcendent Wisdom", "Incomprehensible Wisdom", "Ultimate Reality"]
            },
            "Power": {
                // Similar outcome object structure for Power
            },
            "Protection": {
                // Similar outcome object structure for Protection
            }
        }
    },
    {
        question: "What is your character’s greatest fear?",
        image: "path/to/image2.png",
        choices: ["Getting trapped in the darkness.", "Causing someone to be hurt.", "Losing something that's important."],
        outcomes: {
            "Getting trapped in the darkness.": {
                // Similar outcome object structure for fears
            },
            "Causing someone to be hurt.": {
                // Similar outcome object structure for fears
            },
            "Losing something that's important.": {
                // Similar outcome object structure for fears
            }
        }
    },
    {
        question: "What is the one thing you care about more than anything else?",
        image: "path/to/image3.png",
        choices: ["The hearts connected by light.", "My close friends.", "The strength to protect others."],
        outcomes: {
            "The hearts connected by light.": {
                // Similar outcome object structure for values
            },
            "My close friends.": {
                // Similar outcome object structure for values
            },
            "The strength to protect others.": {
                // Similar outcome object structure for values
            }
        }
    },
    {
        question: "What do you wish?",
        image: "path/to/image4.png",
        choices: ["To protect my friends.", "To recover something important.", "To heal the pain from the past."],
        outcomes: {
            "To protect my friends.": {
                // Similar outcome object structure for wishes
            },
            "To recover something important.": {
                // Similar outcome object structure for wishes
            },
            "To heal the pain from the past.": {
                // Similar outcome object structure for wishes
            }
        }
    }
];
