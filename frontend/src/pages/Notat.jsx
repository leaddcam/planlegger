import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { lagreNotat, oppdaterNotat, hentNotatMedId } from '../api/notater';
import '../styles/Notat.css';

function Notat() {
  const { navn, notatId, blokk } = useParams();
  const [tittel, settTittel] = useState('');
  const [innhold, settInnhold] = useState('');

  // Henter eksisterende notat hvis det finnes
  useEffect(() => {
    async function hent() {
      if (!notatId || isNaN(Number(notatId))) return;

      try {
        const notat = await hentNotatMedId(notatId);
        settTittel(notat.tittel);
        settInnhold(notat.innhold);
      } catch (err) {
        console.error('Feil ved henting:', err);
      }
    }

    hent();
  }, [notatId]);

  const handleLagre = async () => {
    try {
      if (notatId && !isNaN(Number(notatId))) {
        await oppdaterNotat(notatId, { tittel, innhold });
        alert('Notatet ble oppdatert!');
      } else {
        await lagreNotat({ interesse: navn, tittel, innhold, blokk });
        alert('Notatet ble opprettet!');
      }
    } catch (err) {
      alert('Feil ved lagring: ' + err.message);
    }
  };

  return (
    <div className="notat-editor">
      <input
        className="notat-input"
        type="text"
        value={tittel}
        onChange={e => settTittel(e.target.value)}
        placeholder="Tittel"
      />
      <textarea
        className="notat-textarea"
        value={innhold}
        onChange={e => settInnhold(e.target.value)}
        rows={12}
        cols={50}
        placeholder="Skriv notatet her..."
      />
      <br />
      <button onClick={handleLagre} className="lagre-knapp">Lagre</button>
    </div>
  );
}

export default Notat;


