// navigerer brukeren til oversikten for en interesse
import '../styles/TilNotatbok.css';
import { useNavigate, useParams } from 'react-router-dom';

function Oversikt() {
  const naviger = useNavigate();
  const {interesse} = useParams();

  const onClick = () => {
    naviger(`/interesse/${interesse}`);
  };

  return (
    <button className="knapp" onClick={onClick}>
      ←
    </button>
  );
}

export default Oversikt;