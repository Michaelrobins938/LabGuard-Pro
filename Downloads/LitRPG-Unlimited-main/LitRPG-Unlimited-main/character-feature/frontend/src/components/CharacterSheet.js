import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CharacterSheet = ({ userId }) => {
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/character-sheet/${userId}`)
      .then(response => setCharacter(response.data))
      .catch(error => console.error(error));
  }, [userId]);

  if (!character) return <div>Loading...</div>;

  return (
    <div className="character-sheet">
      <h1>Character Sheet</h1>
      <img src={character.characterId.image_url} alt={character.characterId.name} />
      <p><strong>Level:</strong> {character.level}</p>
      <p><strong>Strength:</strong> {character.strength}</p>
      <p><strong>Agility:</strong> {character.agility}</p>
      <p><strong>Intelligence:</strong> {character.intelligence}</p>
      <p><strong>Achievements:</strong> {JSON.stringify(character.achievements)}</p>
    </div>
  );
};

export default CharacterSheet;
