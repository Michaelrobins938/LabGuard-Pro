import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CharacterSelection = ({ userId }) => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    // For now, we'll use a hardcoded array of character objects.
    const characters = [
      {
        _id: '1',
        name: 'Character 1',
        image_url: 'https://lh3.googleusercontent.com/pw/AP1GczPQFDi8MFHJ7ENDs-TJ4TTqB-7wlmLA9Di8n00R_KJnld6ME5MFHMnLuiKQpAbi5jW1-_cyDg0WsQ8oDqJihxqXsBB0dH9Ql_dh9ylJTgOo6ri4bjHQ=w2400'
      },
      {
        _id: '2',
        name: 'Character 2',
        image_url: 'https://lh3.googleusercontent.com/pw/AP1GczM4jyDHX8bOYBmKCUledoZTfi3NwYRydu6TVJRnbTGepvJi7c95X4TqEqog5DPI2eHncRZGQpLJCvbM5qfXUZ8L8acIM923r1J_pNJJk_Qj0-sXOb7n=w2400'
      }
    ];

    setCharacters(characters);
  }, []);

  const selectCharacter = (characterId) => {
    axios.post('http://localhost:5000/api/select-character', { userId, characterId })
      .then(response => alert('Character selected!'))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Select Your Character</h1>
      <div className="character-container">
        {characters.map(character => (
          <div key={character._id} className="character-card">
            <img src={character.image_url} alt={character.name} />
            <h2>{character.name}</h2>
            <button onClick={() => selectCharacter(character._id)}>Select</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelection;
