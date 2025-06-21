// navigerer bruker til valgt Notatblokk (page)

import {useNavigate, useParams} from 'react-router-dom';

function TilNotatblokk({notatblokk}) {
    const naviger = useNavigate();
    const {navn} = useParams(); // henter interessenavn fra URL

    const handleClick = () => {naviger(`/interesse/${navn}/notatbok/blokk/${notatblokk}`)};

    return (
        <button onClick={handleClick}>
            {notatblokk}
        </button>
    )
}

export default TilNotatblokk;