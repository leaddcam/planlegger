// navigerer brukeren til en Notatbok (liste over løse notater og notatblokker)
import '../../styles/TilNotatbok.css';
import { useNavigate, useParams } from 'react-router-dom';

function UtAvBlokk() {
  const naviger = useNavigate();
  const { interesse } = useParams();

  const onClick = () => {
    naviger(`/interesse/${interesse}/notatbok`);
  };

  return (
    <button className="knapp" onClick={onClick}>
      ←
    </button>
  );
}

export default UtAvBlokk;