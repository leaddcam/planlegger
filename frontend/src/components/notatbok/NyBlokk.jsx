import '../../styles/NyBlokk.css';
import { useState } from 'react';
import { lagreNotatblokk } from '../../api/notatblokker'; 

function NyBlokk({ blokk, settBlokk, interesse }) {
  const [venter, settVenter] = useState(false);

  const leggTilBlokk = async () => {
    const navn = prompt("Ny blokk:");
    if (!navn) return;

    if (blokk[navn]) {
      alert('Blokk med dette navnet finnes allerede.');
      return;
    }

    try {
      settVenter(true);
      // Kaller API for å lagre blokk i databasen
      const nyBlokk = await lagreNotatblokk({ interesse, navn });
      // nyBlokk = { blokkId, navn }
      
      // Oppdaterer blokk state med blokkId som nøkkel
      settBlokk(prev => ({
        ...prev,
        [nyBlokk.blokkId]: { navn: nyBlokk.navn, notater: [] }
      }));
    } catch (err) {
      alert('Kunne ikke lagre blokken: ' + err.message);
    } finally {
      settVenter(false);
    }
  };

  return (
    <button onClick={leggTilBlokk} disabled={venter} className="ny-blokk">
      {venter ? 'Lagrer...' : '📁'}
    </button>
  );
}

export default NyBlokk;

