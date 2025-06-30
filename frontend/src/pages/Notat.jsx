import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hentNotatMedId, lagreNotat, oppdaterNotat } from '../api/notatbok';
import '../styles/Notat.css';

function Notat() {
  const { interesse, notatId, blokkId } = useParams();
  const navigate = useNavigate();

  const [tittel, settTittel] = useState('');
  const [innhold, settInnhold] = useState('');
  const [erNytt, settErNytt] = useState(!notatId); // antar nytt hvis ingen notatId

  const eksisterer = !!notatId && !isNaN(Number(notatId));
  const renBlokkId = !isNaN(parseInt(blokkId)) ? parseInt(blokkId) : null;

  useEffect(() => {
    if (!eksisterer) return;

    async function hent() {
      try {
        const notat = await hentNotatMedId(notatId);
        if (notat === undefined) {
          console.warn('Fant ikke notat med id', notatId);
        } else {
          settTittel(notat.tittel);
          settInnhold(notat.innhold);
          settErNytt(false); // notat eksisterer faktisk
        }
      } catch (err) {
        console.error('Feil ved henting av notat:', err);
      }
    }

    hent();
  }, [notatId]);

  const handleLagre = async () => {
    try {
      if (eksisterer && !erNytt) {
        await oppdaterNotat(notatId, { tittel, innhold });
        alert('Notatet ble oppdatert!');
      } else {
        const respons = await lagreNotat({
          interesse,
          tittel,
          innhold,
          blokkId: renBlokkId,
        });
        alert('Notatet ble lagret!');
        settErNytt(false);
        navigate(
          renBlokkId !== null
            ? `/interesse/${interesse}/notatbok/blokk/${renBlokkId}/notat/${respons.notatId}`
            : `/interesse/${interesse}/notatbok/notat/${respons.notatId}`
        );
      }
    } catch (err) {
      alert('Kunne ikke lagre notatet.');
      console.error('Feil ved lagring:', err);
    }
  };

  const handleTilbake = () => {
    if (renBlokkId !== null) {
      navigate(`/interesse/${interesse}/notatbok/blokk/${renBlokkId}`);
    } else {
      navigate(`/interesse/${interesse}/notatbok`);
    }
  };

  return (
    <div className="notat-editor">
      <input
        type="text"
        value={tittel}
        onChange={(e) => settTittel(e.target.value)}
        placeholder="Tittel"
        className="notat-input"
      />

      <textarea
        value={innhold}
        onChange={(e) => settInnhold(e.target.value)}
        placeholder="Skriv inn notatet her..."
        className="notat-textarea"
        rows={10}
      />

      <div className="knappe-container">
        <button onClick={handleTilbake} className="tilbake-knapp">
          ← Tilbake
        </button>
        <button onClick={handleLagre} className="lagre-knapp">
          Lagre
        </button>
      </div>
    </div>
  );
}

export default Notat;




