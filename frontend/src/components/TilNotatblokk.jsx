// navigerer bruker til valgt Notatblokk (page)
import {useNavigate, useParams} from 'react-router-dom';
import '../styles/TilNotatblokk.css';

function TilNotatblokk({notatblokk}) {
    const naviger = useNavigate();
    const {interesse} = useParams(); // henter interessenavn fra URL

    const handleClick = () => {naviger(`/interesse/${interesse}/notatbok/blokk/${notatblokk}`)};

    return (
        <button onClick={handleClick} className="til-blokk">
            {notatblokk}
        </button>
    )
}

export default TilNotatblokk;