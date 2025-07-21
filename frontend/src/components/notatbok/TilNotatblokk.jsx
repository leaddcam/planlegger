// navigerer bruker til valgt Notatblokk (page)
import {useNavigate, useParams} from 'react-router-dom';
import '../../styles/TilNotatblokk.css';

function TilNotatblokk({blokkNavn, blokkId}) {
    const naviger = useNavigate();
    const {interesse} = useParams(); // henter interessenavn fra URL

    const handleClick = () => {naviger(`/interesse/${interesse}/notatbok/blokk/${blokkId}`)};

    return (
        <button onClick={handleClick} className="til-blokk">
            {blokkNavn}
        </button>
    )
}

export default TilNotatblokk;