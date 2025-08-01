import React, { useState, useEffect } from 'react';

const Quest = () => {
    const [questName, setQuestName] = useState('');
    const [steps, setSteps] = useState('');
    const [quest, setQuest] = useState(null);

    const handleCreateQuest = async () => {
        const token = sessionStorage.getItem('token');
        const response = await fetch('/api/quest/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: questName, steps: steps.split(',') })
        });

        if (response.ok) {
            alert('Quest created successfully');
        } else {
            alert('Failed to create quest');
        }
    };

    const handleCompleteStep = async (step) => {
        const token = sessionStorage.getItem('token');
        const response = await fetch('/api/quest/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: questName, step })
        });

        if (response.ok) {
            alert('Step completed successfully');
        } else {
            alert('Failed to complete step');
        }
    };

    const handleViewQuest = async () => {
        const response = await fetch(`/api/quest/${questName}`);
        if (response.ok) {
            const data = await response.json();
            setQuest(data);
        } else {
            alert('Failed to view quest');
        }
    };

    return (
        <div>
            <h2>Quest Management</h2>
            <input
                type="text"
                placeholder="Quest Name"
                value={questName}
                onChange={(e) => setQuestName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Quest Steps (comma separated)"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
            />
            <button onClick={handleCreateQuest}>Create Quest</button>
            <button onClick={handleViewQuest}>View Quest</button>

            {quest && (
                <div>
                    <h3>{quest.name}</h3>
                    <ul>
                        {quest.steps.map((step, index) => (
                            <li key={index}>
                                {step}
                                <button onClick={() => handleCompleteStep(step)}>Complete Step</button>
                            </li>
                        ))}
                    </ul>
                    <p>Completed by:</p>
                    <ul>
                        {quest.completedBy.map((completion, index) => (
                            <li key={index}>{completion.user} - {completion.step}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Quest;
