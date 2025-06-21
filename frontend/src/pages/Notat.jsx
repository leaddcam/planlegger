import {useParams} from 'react-router-dom';
import {useState} from 'react';
import {lagreNotat} from '../api/notater';

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
    <div>
      <h1>Notat for {navn}</h1>
      <input
        type="text"
        value={tittel}
        onChange={e => settTittel(e.target.value)}
        placeholder="Tittel"
      />
      <textarea
        value={innhold}
        onChange={e => settInnhold(e.target.value)}
        rows={10}
        cols={50}
        placeholder="Skriv notatet her..."
      />
      <br />
      <button onClick={handleLagre}>Lagre</button>
    </div>
  );
}

export default NotatSide;

