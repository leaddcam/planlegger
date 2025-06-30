import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { lagreNotat } from '../api/notater';
import NyttNotatModal from './NyttNotatModal';
import '../styles/NyttNotat.css';

function NyttNotat({ interesse: propInteresse, blokkId, settNotat }) {
  const [visModal, settVisModal] = useState(false);
  const navigate = useNavigate();
  const { interesse: urlInteresse } = useParams(); // henter fra URL
  const interesse = propInteresse || urlInteresse; // fallback

  const lagreMedTittel = async (tittel) => {
    try {
      console.log("Notat: ", {interesse, tittel, blokkId});
      const nyttNotat = await lagreNotat({interesse, tittel, innhold: '', blokkId});

      // oppdaterer listen i Notatblokk-siden
      if (settNotat) {
        settNotat(prev => [...prev,nyttNotat]);
      }
      // Naviger etter lagring
      if (!isNaN(blokkId) && blokkId !== null && blokkId !== undefined) {
        navigate(`/interesse/${interesse}/notatbok/blokk/${blokkId}/notat/${nyttNotat.notatId}`);
      } else {
        navigate(`/interesse/${interesse}/notatbok/notat/${nyttNotat.notatId}`);
      }
    } catch (error) {
      alert("Feil ved lagring av notatet.");
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={() => settVisModal(true)} className="nytt-notat">📝</button>
      {visModal && (
        <NyttNotatModal
          onLukk={() => settVisModal(false)}
          onLagre={lagreMedTittel}
        />
      )}
    </>
  );
}

export default NyttNotat;


