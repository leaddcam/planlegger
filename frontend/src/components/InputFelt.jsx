// src/components/UrlInput.jsx

import { useState } from 'react';
import '../styles/InputFelt.css';

function InputFelt() {
  const [url, setUrl] = useState('');

  return (
    <div className="url-input-container">
      <label>
        Lim inn URL til emnesiden:
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
        />
      </label>

      {url && (
        <p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Gå til beskrivelse
          </a>
        </p>
      )}
    </div>
  );
}

export default InputFelt;

