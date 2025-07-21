import '../styles/TilEmne.css'; // InteresseKnapp.css
import {useNavigate} from 'react-router-dom';

function TilInteresse({interesse}) {
    const naviger = useNavigate();
    const handleClick = () => naviger(`/interesse/${interesse}`);

    return (
        <button onClick={handleClick}>
            {interesse}
        </button>
    );
}

export default TilInteresse;