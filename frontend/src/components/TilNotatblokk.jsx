// navigerer bruker til valgt Notatblokk (page)

import {useNavigate, useParams} from 'react-router-dom';

function TilNotatblokk() {
    const naviger = useNavigate();
    const {navn} = useParams(); // henter interessenavn fra URL

    const handleClick = () => {naviger(`/interesse/${navn}/notatbok/${notatblokk}`)};

    return (
        <button onClick={handleClick}>
            Notat
        </button>
    )
}

export default TilNotatblokk;