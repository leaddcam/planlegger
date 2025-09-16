import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { lagreNotat } from '../../api/notater';
import NyttNotatModal from './NyttNotatModal';
import '../../styles/NyttNotat.css';

/**
 * Props:
 * - interesse?: string | null
 * - emne?: string | null
 * - blokkId?: number | null
 * - settNotat?: setState (liste)
 */
function NyttNotat({ interesse: propInteresse = null, emne: propEmne = null, blokkId = null, settNotat }) {
  const [visModal, settVisModal] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  // Fallback til URL-param om prop ikke er satt
  const interesse = propInteresse ?? params.interesse ?? null;
  const emne = propEmne ?? params.emne ?? params.emnekode ?? null;

  const lagreMedTittel = async (tittel) => {
    try {
      const harBlokk =
        blokkId !== null && blokkId !== undefined && !Number.isNaN(Number(blokkId));

      // Lagre notat – eksakt én av interesse/emne skal ha verdi
      const nyttNotat = await lagreNotat({
        tittel,
        innhold: '',
        blokkId: harBlokk ? Number(blokkId) : null,
        interesse: interesse ? String(interesse) : null,
        emne: interesse ? null : (emne ? String(emne) : null),
      });

      // Oppdater antall i blokk hvis relevant
      if (harBlokk) {
        await fetch(`http://localhost:3000/api/notatblokker/oppdater-antall/${Number(blokkId)}`, {
          method: 'POST',
        });
      }

      // Oppdater lokal state (legg til nytt notat i liste)
      if (settNotat) {
        settNotat((prev) => [...prev, { ...nyttNotat, blokkId: harBlokk ? Number(blokkId) : null, tittel, innhold: '' }]);
      }

      // Naviger til det nye notatet
      if (interesse) {
        if (harBlokk) {
          navigate(`/interesse/${interesse}/notatbok/blokk/${Number(blokkId)}/notat/${nyttNotat.notatId}`);
        } else {
          navigate(`/interesse/${interesse}/notatbok/notat/${nyttNotat.notatId}`);
        }
      } else if (emne) {
        // Emne-kontekst: juster til din faktiske rute for visning av enkelt-notat
        navigate(`/emne/${emne}/notatbok/notat/${nyttNotat.notatId}`);
      } else {
        navigate(`/`);
      }
    } catch (error) {
      alert('Feil ved lagring av notatet.');
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={() => settVisModal(true)} className="nytt-notat">
        📝
      </button>
      {visModal && (
        <NyttNotatModal onLukk={() => settVisModal(false)} onLagre={lagreMedTittel} />
      )}
    </>
  );
}

export default NyttNotat;
