import '../styles/NyttNotat.css';
import { lagreNotat } from '../api/notater'; // your API function to POST a new note

function NyttNotat({ settNotat, interesse, blokk = null }) {
  const leggTilNotat = async () => {
    const tittel = prompt("Nytt notat:");
    if (tittel) {
      try {
        // Prepare new note data
        const nyttNotatData = {
          interesse,    // pass interesse as prop to know which interesse to assign
          tittel,
          innhold: '',
          blokk,       // optional blokk string or null
        };
        
        // Send POST request to backend to save note
        const nyttNotat = await lagreNotat(nyttNotatData);

        // Update state with note returned from backend (including real id)
        settNotat(prev => [...prev, nyttNotat]);
      } catch (error) {
        alert("Noe gikk galt ved lagring av notatet.");
        console.error(error);
      }
    }
  };

  return (
    <button onClick={leggTilNotat} className="nytt-notat">📝</button>
  );
}

export default NyttNotat;
