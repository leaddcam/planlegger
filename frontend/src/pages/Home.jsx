// hjemmesiden

import React from 'react';
import {TilEmne, TilInteresse} from '../components';
import '../styles/Home.css';

function Home() {
    return (
        <>
        <div className="home-container">
            <h1>Velkommen til din planlegger :)</h1>

            <div className="lister-container">
                <div className="liste-seksjon">
                    <h2>Dine emner:</h2>
                    <ul className="emne-liste">
                        {/* emner: IN2010, IN2031, IN2090, IN2120, ECON1210 */}
                        <li><TilEmne emne='IN2010' /></li>
                        <li><TilEmne emne='IN2031' /></li>
                        <li><TilEmne emne='IN2090' /></li>
                        <li><TilEmne emne='IN2120' /></li>
                    </ul>
                </div>

                <div className="liste-seksjon">
                    <h2>Interesser:</h2>
                    <ul className="interesse-liste">
                        <li><TilInteresse interesse="programmering" /></li>
                        <li><TilInteresse interesse="geografi" /></li>
                        <li><TilInteresse interesse="progresjon" /></li>
                    </ul>
                </div>
            </div>
        </div>
        </>
    );
}

export default Home;