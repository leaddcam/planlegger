import React from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/Startside.css';

function Startside() {
    const naviger = useNavigate();

    return (
        <div className="startside">
            <button className="startside-knapp" onClick={() => naviger('/home')}>
            Hjemmeside
        </button>
        </div>
    )
}

export default Startside;