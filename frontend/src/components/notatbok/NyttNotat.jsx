import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { lagreNotat } from '../../api/notater';
import NyttNotatModal from './NyttNotatModal';
import '../../styles/NyttNotat.css';

function NyttNotat({ interesse: propInteresse, blokkId, settNotat }) {
  const [visModal, settVisModal] = useState(false);
  const navigate = useNavigate();
  const { interesse: urlInteresse } = useParams(); // henter fra URL
  const interesse = propInteresse || urlInteresse; // fallback

  console.log(blokkId);

  const lagreMedTittel = async (tittel) => {
  try {
    console.log("Notat: ", { interesse, tittel, blokkId });

    // Bestem om dette er et "løst" notat eller tilhører en blokk
    const harBlokk = !isNaN(blokkId) && blokkId !== null && blokkId !== undefined;

    // 1. Lagre notat (med eller uten blokkId)
    const nyttNotat = await lagreNotat({
      interesse,
      tittel,
      innhold: '',
      blokkId: harBlokk ? blokkId : null
    });

    // 2. Oppdater backend for notatblokker dersom blokkId er satt
    if (harBlokk) {
      await fetch(`http://localhost:3000/api/notatblokker/oppdater-antall/${blokkId}`, {
        method: 'POST'
      });
    }

    // 3. Oppdater frontend
    if (settNotat) {
      settNotat((prev) => [...prev, nyttNotat]);
    }

    // 4. Naviger til notatsiden
    if (harBlokk) {
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


