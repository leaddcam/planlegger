// navigerer brukeren til en Notatbok (liste over løse notater og notatblokker)
import '../../styles/TilNotatbok.css';
import { useNavigate, useParams } from 'react-router-dom';

function UtAvBlokk() {
  const naviger = useNavigate();
  const { interesse, emnekode } = useParams();

  const onClick = () => {
    if (interesse) {
      naviger(`/interesse/${interesse}/notatbok`);
    } 
    if (emnekode) {
      naviger(`/emne/${emnekode}/notatbok`);
    }
  };

  return (
    <button className="knapp" onClick={onClick}>
      ←
    </button>
  );
}

export default UtAvBlokk;