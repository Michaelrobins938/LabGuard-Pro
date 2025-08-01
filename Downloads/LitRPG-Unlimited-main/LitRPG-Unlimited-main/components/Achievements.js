import React, { useState, useEffect } from 'react';

const Achievements = () => {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        fetch('/api/achievement')
            .then(response => response.json())
            .then(data => setAchievements(data));
    }, []);

    return (
        <div>
            <h2>Achievements</h2>
            <ul>
                {achievements.map((ach, index) => (
                    <li key={index}>{ach.user}: {ach.achievement}</li>
                ))}
            </ul>
        </div>
    );
};

export default Achievements;
