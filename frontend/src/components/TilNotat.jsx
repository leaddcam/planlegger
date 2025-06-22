// navigerer bruker til valgt Notat (page)
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/TilNotat.css';

function TilNotat({ notat }) {
  const naviger = useNavigate();
  const { navn } = useParams();

  const handleClick = () => naviger(`/interesse/${navn}/notatbok/notat/${notat}`);

  return (
    <button onClick={handleClick} className="til-notat">
      {notat}
    </button>
  );
}

export default TilNotat;
