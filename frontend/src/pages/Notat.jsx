import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { lagreNotat, oppdaterNotat, hentNotatMedId } from '../api/notatbok';
import '../styles/Notat.css';

function Notat() {
  const { interesse, notatId, blokkId } = useParams();
  const navigate = useNavigate();
  const [tittel, settTittel] = useState('');
  const [innhold, settInnhold] = useState('');
  const eksisterer = notatId && !isNaN(Number(notatId));

  useEffect(() => {
    if (!eksisterer) return;

    async function hent() {
      try {
        const notat = await hentNotatMedId(notatId);
        if (notat == undefined) {
          console.warn('Fant ikke notat med id ', notatId);
        }
        settTittel(notat.tittel);
        settInnhold(notat.innhold);
      } catch (err) {
        console.error('Feil ved henting:', err);
      }
    }
    hent();
  }, [notatId]);

  const handleTilbake = async () => {
    try {
      if (eksisterer) {
        // Oppdater eksisterende notat
        await oppdaterNotat(notatId, { tittel, innhold });
      } else {
        // Lagre nytt notat og få tilbake id
        const nyttNotat = await lagreNotat({ interesse, tittel, innhold, blokkId });
        // Naviger til den nye notatens side med id
        if (blokk===null) {
          navigate(`/interesse/${interesse}/notatbok/notat/${nyttNotat.id}`);
        } else {
          navigate(`/interesse/${interesse}/notatbok/blokk/${blokkId}/notat/${nyttNotat.id}`);
        }
        return; // Viktig å returnere så ikke navigerer to ganger
      }

      // Naviger tilbake til notatbok eller blokk
      if (blokkId) {
        navigate(`/interesse/${interesse}/notatbok/blokk/${blokkId}`);
      } else {
        navigate(`/interesse/${interesse}/notatbok`);
      }
    } catch (err) {
      alert('Kunne ikke lagre notatet.');
      console.error('Feil ved lagring:', err);
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
      <button onClick={handleTilbake} className="tilbake-knapp">
        ← Tilbake
      </button>
    </div>
  );
}

export default Notat;



