// navigerer bruker til valgt Notatblokk (page)
import {useNavigate, useParams} from 'react-router-dom';
import '../../styles/TilNotatblokk.css';

function TilNotatblokk({blokkNavn, blokkId}) {
    const naviger = useNavigate();
    const {interesse, emnekode} = useParams(); // henter interessenavn fra URL

    const handleClick = () => {
        if (interesse) {
            naviger(`/interesse/${interesse}/notatbok/blokk/${blokkId}`);
        } 
        if (emnekode) {
            naviger(`/emne/${emnekode}/notatbok/blokk/${blokkId}`);
        }
    };

    return (
        <button onClick={handleClick} className="til-blokk">
            {blokkNavn}
        </button>
    )
}

export default TilNotatblokk;