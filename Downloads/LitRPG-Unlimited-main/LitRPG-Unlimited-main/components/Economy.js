import React, { useState, useEffect } from 'react';

const Economy = () => {
    const [currency, setCurrency] = useState(0);
    const [amount, setAmount] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        fetch('/api/economy/balance', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => setCurrency(data.currency));
    }, []);

    const handleEarnCurrency = async () => {
        const token = sessionStorage.getItem('token');
        const response = await fetch('/api/economy/earn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: parseInt(amount) })
        });

        if (response.ok) {
            setCurrency(currency + parseInt(amount));
            setAmount('');
        } else {
            alert('Failed to earn currency');
        }
    };

    const handleSpendCurrency = async () => {
        const token = sessionStorage.getItem('token');
        const response = await fetch('/api/economy/spend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: parseInt(amount) })
        });

        if (response.ok) {
            setCurrency(currency - parseInt(amount));
            setAmount('');
        } else {
            alert('Failed to spend currency');
        }
    };

    return (
        <div>
            <h2>In-game Economy</h2>
            <p>Balance: {currency}</p>
            <input
                type="text"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleEarnCurrency}>Earn Currency</button>
            <button onClick={handleSpendCurrency}>Spend Currency</button>
        </div>
    );
};

export default Economy;
