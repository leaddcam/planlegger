// navigerer bruker til valgt Notat (page)

import {useNavigate, useParams} from 'react-router-dom';

function TilNotat() {
    const naviger = useNavigate();
    const {navn} = useParams(); // henter interessenavn fra URL

    const handleClick = () => {naviger(`/interesse/${navn}/notatbok/:notat`)};

    return (
        <button onClick={handleClick}>
            Notatbok
        </button>
    )
}

export default TilNotat;