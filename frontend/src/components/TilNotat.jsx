// navigerer bruker til valgt Notat (page)
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/TilNotat.css';

function TilNotat({notat, blokkId}) {
  const naviger = useNavigate();
  const { interesse } = useParams();

  const handleClick = () => {
    if (blokk!==null) {
        naviger(`/interesse/${interesse}/notatbok/blokk/${blokkId}/notat/${notat.id}`)
    } else {
        naviger(`/interesse/${interesse}/notatbok/notat/${notat.id}`);
    }
  };
  
  return (
    <button onClick={handleClick} className="til-notat">
      {notat.tittel}
    </button>
  );
}

export default TilNotat;
