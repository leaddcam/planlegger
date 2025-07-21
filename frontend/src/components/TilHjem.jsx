// navigerer brukeren til hjemsiden (liste over løse notater og notatblokker)
import '../styles/TilNotatbok.css';
import { useNavigate } from 'react-router-dom';

function TilHjem() {
  const naviger = useNavigate();

  const onClick = () => {
    naviger(`/home`);
  };

  return (
    <button className="knapp" onClick={onClick}>
      ←
    </button>
  );
}

export default TilHjem;