import React, { useState, useEffect } from 'react';

const HousePoints = () => {
    const [houses, setHouses] = useState({});
    const [house, setHouse] = useState('');
    const [points, setPoints] = useState('');

    useEffect(() => {
        fetch('/api/house')
            .then(response => response.json())
            .then(data => setHouses(data));
    }, []);

    const handleAddPoints = async () => {
        const token = sessionStorage.getItem('token');
        const response = await fetch('/api/house/addPoints', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ house, points: parseInt(points) })
        });

        if (response.ok) {
            setHouses(prevHouses => ({
                ...prevHouses,
                [house]: {
                    ...prevHouses[house],
                    points: prevHouses[house].points + parseInt(points)
                }
            }));
            setHouse('');
            setPoints('');
        } else {
            alert('Failed to add points');
        }
    };

    return (
        <div>
            <h2>House Points</h2>
            <ul>
                {Object.values(houses).map(h => (
                    <li key={h.name}>{h.name}: {h.points} points</li>
                ))}
            </ul>
            <div>
                <input
                    type="text"
                    placeholder="House"
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Points"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                />
                <button onClick={handleAddPoints}>Add Points</button>
            </div>
        </div>
    );
};

export default HousePoints;
