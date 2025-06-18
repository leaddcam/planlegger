import '../styles/EmneKnapp.css'; // InteresseKnapp.css
import {useNavigate} from 'react-router-dom';

function InteresseKnapp({navn}) {
    const naviger = useNavigate();

    const handleClick = () => naviger(`/interesse/${navn}`);
    return (
        <button onClick={handleClick}>
            {navn}
        </button>
    );
}

export default InteresseKnapp;