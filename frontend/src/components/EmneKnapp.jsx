import '../styles/EmneKnapp.css';
import {useNavigate} from 'react-router-dom';

function EmneKnapp({emne}) {
    const naviger = useNavigate();

    return (
        <button onClick={() => naviger(`/emne/${emne}`)}>
            {emne}
        </button>
    );
}

export default EmneKnapp;