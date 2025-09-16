// navigerer brukeren til oversikten for en interesse
import '../styles/TilNotatbok.css';
import { useNavigate, useParams } from 'react-router-dom';

function Oversikt() {
  const naviger = useNavigate();
  const {interesse, emnekode} = useParams();

  const onClick = () => {
    if (interesse) {
      naviger(`/interesse/${interesse}`);
    }
    if (emnekode) {
      naviger(`/emne/${emnekode}`);
    }
  };

  return (
    <button className="knapp" onClick={onClick}>
      ←
    </button>
  );
}

export default Oversikt;