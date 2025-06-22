// navigerer bruker til valgt Notat (page)
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/TilNotat.css';

function TilNotat({ notat, blokk }) {
  const naviger = useNavigate();
  const { navn } = useParams();

  const handleClick = () => {
    if (blokk) {
        naviger(`/interesse/${navn}/notatbok/blokk/${blokk}/notat/${notat}`)
    } else {
        naviger(`/interesse/${navn}/notatbok/notat/${notat}`);
    }
  };
  
  return (
    <button onClick={handleClick} className="til-notat">
      {notat}
    </button>
  );
}

export default TilNotat;
