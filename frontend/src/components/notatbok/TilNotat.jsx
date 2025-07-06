// navigerer bruker til valgt Notat (page)
import {useNavigate, useParams} from 'react-router-dom';
import '../../styles/TilNotat.css';

function TilNotat({notat, blokkId}) {
  const naviger = useNavigate();
  const { interesse } = useParams();

  const handleClick = () => {
    if (isNaN(blokkId)) {
        naviger(`/interesse/${interesse}/notatbok/notat/${notat.notatId}`)
    } else {
        naviger(`/interesse/${interesse}/notatbok/blokk/${blokkId}/notat/${notat.notatId}`);
    }
  };
  
  return (
    <button onClick={handleClick} className="til-notat">
      {notat.tittel}
    </button>
  );
}

export default TilNotat;
