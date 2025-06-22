import {useParams} from 'react-router-dom';
import {useState} from 'react';
import {lagreNotat} from '../api/notater';
import '../styles/Notat.css';

function NotatSide() {
  const { navn, notatId } = useParams();
  const [innhold, settInnhold] = useState('');
  const [tittel, settTittel] = useState('');

  const handleLagre = async () => {
    try {
      await lagreNotat({
        interesse: navn,
        tittel: tittel || `Notat ${notatId}`,
        innhold
      });
      alert('Notatet er lagret!');
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
        rows={10}
        cols={50}
        placeholder="Skriv notatet her..."
      />
      <br />
      <button onClick={handleLagre} className="lagre-knapp">Lagre</button>
    </div>
  );
}

export default NotatSide;

