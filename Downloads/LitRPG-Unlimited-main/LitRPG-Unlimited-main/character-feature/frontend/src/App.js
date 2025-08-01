import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CharacterSelection from './components/CharacterSelection';
import CharacterSheet from './components/CharacterSheet';

const App = () => {
  const userId = 'your_user_id'; // Replace with actual user ID

  return (
    <Router>
      <Routes>
        <Route path="/select-character" element={<CharacterSelection userId={userId} />} />
        <Route path="/character-sheet" element={<CharacterSheet userId={userId} />} />
      </Routes>
    </Router>
  );
};

export default App;
