// navigerer bruker til valgt Notat (page)
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/TilNotat.css';

function TilNotat({ notat, blokkId }) {
  const naviger = useNavigate();
  const {interesse, emnekode} = useParams();

  const harBlokk =
    blokkId !== null && blokkId !== undefined && !Number.isNaN(Number(blokkId));

  const handleClick = () => {
    if (interesse) {
      // interesse-kontekst
      if (harBlokk) {
        naviger(`/interesse/${interesse}/notatbok/blokk/${Number(blokkId)}/notat/${notat.notatId}`);
      } else {
        naviger(`/interesse/${interesse}/notatbok/notat/${notat.notatId}`);
      }
      return;
    }

    if (emnekode) {
      // emne-kontekst
      if (harBlokk) {
        naviger(`/emne/${emnekode}/notatbok/blokk/${Number(blokkId)}/notat/${notat.notatId}`);
      } else {
        naviger(`/emne/${emnekode}/notatbok/notat/${notat.notatId}`);
      }
      return;
    }

    // fallback (om ingen kontekst finnes)
    naviger(`/`);
  };

  return (
    <button onClick={handleClick} className="til-notat">
      {notat.tittel}
    </button>
  );
}

export default TilNotat;
