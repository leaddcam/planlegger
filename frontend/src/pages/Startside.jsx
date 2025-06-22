import React from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/Startside.css';

function Startside() {
    const naviger = useNavigate();

    return (
        <div className="startside">
            <button className="login" onClick={() => naviger('/home')}>
                Logg inn
            </button>
            <button className="signup" onClick={() => alert("ingen bruker?")}>
                Registrer bruker
            </button>
        </div>
    )
}

export default Startside;