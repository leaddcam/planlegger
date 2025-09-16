import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hentNotatById, lagreNotat, oppdaterNotat } from '../../api/notater';
import '../../styles/Notat.css';

function Notat() {
  // Støtt både interesse og emne (noen steder heter emne "emnekode")
  const params = useParams();
  const { interesse, notatId, blokkId } = params;
  const emne = params.emne ?? params.emnekode ?? null;

  const navigate = useNavigate();

  const [tittel, settTittel] = useState('');
  const [innhold, settInnhold] = useState('');
  const [erNytt, settErNytt] = useState(!notatId); // nytt hvis ingen notatId

  const eksisterer = !!notatId && !isNaN(Number(notatId));
  const renBlokkId = !isNaN(parseInt(blokkId)) ? parseInt(blokkId) : null;

  const iInteresseKontekst = Boolean(interesse);
  const iEmneKontekst = Boolean(emne);

  useEffect(() => {
    if (!eksisterer) return;

    async function hent() {
      try {
        const notat = await hentNotatById(notatId);
        if (!notat) {
          console.warn('Fant ikke notat med id', notatId);
          return;
        }
        settTittel(notat.tittel ?? '');
        settInnhold(notat.innhold ?? '');
        settErNytt(false);
      } catch (err) {
        console.error('Feil ved henting av notat:', err);
      }
    }

    hent();
  }, [notatId, eksisterer]);

  const handleLagre = async () => {
    try {
      if (eksisterer && !erNytt) {
        await oppdaterNotat(notatId, { tittel, innhold });
        alert('Notatet ble oppdatert!');
        return;
      }

      // Nytt notat:
      // Backend krever at eksakt én av interesse/emne er satt. Send begge, men én er null.
      const respons = await lagreNotat({
        tittel,
        innhold,
        blokkId: renBlokkId,                 // brukes kun i interesse-kontekst
        interesse: iInteresseKontekst ? interesse : null,
        emne: iEmneKontekst ? emne : null,
      });

      alert('Notatet ble lagret!');
      settErNytt(false);

      // Naviger til riktig visning av det nye notatet
      if (iInteresseKontekst) {
        if (renBlokkId !== null) {
          navigate(`/interesse/${interesse}/notatbok/blokk/${renBlokkId}/notat/${respons.notatId}`);
        } else {
          navigate(`/interesse/${interesse}/notatbok/notat/${respons.notatId}`);
        }
      } else if (iEmneKontekst) {
        // Antatt rute for emne-notater uten blokker:
        navigate(`/emne/${emne}/notatbok/notat/${respons.notatId}`);
      } else {
        // Fallback om ingen param finnes
        navigate(`/`);
      }
    } catch (err) {
      alert('Kunne ikke lagre notatet.');
      console.error('Feil ved lagring:', err);
    }
  };

  const handleTilbake = () => {
    if (iInteresseKontekst) {
      if (renBlokkId !== null) {
        navigate(`/interesse/${interesse}/notatbok/blokk/${renBlokkId}`);
      } else {
        navigate(`/interesse/${interesse}/notatbok`);
      }
      return;
    }
    if (iEmneKontekst) {
      // Antatt oversiktsside for emne:
      navigate(`/emne/${emne}/notatbok`);
      return;
    }
    navigate(`/`);
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
