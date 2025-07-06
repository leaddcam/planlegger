// src/components/NyttNotatModal.jsx
import { useState } from "react";
import "../../styles/NyttNotatModal.css";

function NyttNotatModal({ onLukk, onLagre }) {
  const [tittel, settTittel] = useState("");

  const handleLagre = () => {
    if (tittel.trim() !== "") {
      onLagre(tittel);
      onLukk();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-innhold">
        <h2>Nytt notat</h2>
        <input
          type="text"
          placeholder="Tittel på notatet"
          value={tittel}
          onChange={e => settTittel(e.target.value)}
        />
        <div className="modal-knapper">
          <button onClick={onLukk}>Avbryt</button>
          <button onClick={handleLagre}>Lagre</button>
        </div>
      </div>
    </div>
  );
}

export default NyttNotatModal;
