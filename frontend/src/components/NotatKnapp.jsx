import {useNavigate, useParams} from 'react-router-dom';

function NotatKnapp() {
    const naviger = useNavigate();
    const {navn} = useParams(); // henter interessenavn fra URL

    const handleClick = () => {naviger(`/interesse/${navn}/notater`)};

    return (
        <button onClick={handleClick}>
            Notater
        </button>
    )
}

export default NotatKnapp;