import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        fetch('/api/house/leaderboard')
            .then(response => response.json())
            .then(data => setLeaderboard(data));
    }, []);

    return (
        <div>
            <h2>Leaderboard</h2>
            <ol>
                {leaderboard.map(house => (
                    <li key={house.name}>{house.name}: {house.points} points</li>
                ))}
            </ol>
        </div>
    );
};

export default Leaderboard;
