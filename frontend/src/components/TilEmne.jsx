// navigerer bruker til valgt Emne (page)

import '../styles/TilEmne.css';
import {useNavigate} from 'react-router-dom';

function TilEmne({emne}) {
    const naviger = useNavigate();

    return (
        <button onClick={() => naviger(`/emne/${emne}`)}>
            {emne}
        </button>
    );
}

export default TilEmne;