// navigerer bruker til valgt Interesse (page)

import '../styles/TilEmne.css'; // InteresseKnapp.css
import {useNavigate} from 'react-router-dom';

function TilInteresse({navn}) {
    const naviger = useNavigate();
    const handleClick = () => naviger(`/interesse/${navn}`);

    return (
        <button onClick={handleClick}>
            {navn}
        </button>
    );
}

export default TilInteresse;