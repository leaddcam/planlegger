import React, { useState, useEffect } from 'react';
import '../styles/Notatblokk.css';

function Notatblokk() {
  const [note, setNote] = useState(() => {
    // Load saved note from localStorage (if exists)
    return localStorage.getItem('userNote') || '';
  });

  // Save note to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userNote', note);
  }, [note]);

  return (
    <div className="note-container">
      <h2>Notater</h2>
      <textarea
        className="note-textarea"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Skriv notater her..."
      />
    </div>
  );
}

export default Notatblokk;
