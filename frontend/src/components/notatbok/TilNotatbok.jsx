// navigerer brukeren til en Notatbok (liste over løse notater og notatblokker)
import '../../styles/TilNotatbok.css';
import { useNavigate, useParams } from 'react-router-dom';

function TilNotatbok() {
  const naviger = useNavigate();
  const { interesse } = useParams();
  const { emnekode } = useParams();

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
      &#128214;
    </button>
  );
}

export default TilNotatbok;
