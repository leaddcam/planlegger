// hjemmesiden

import React from 'react';
import TilEmne from '../components/TilEmne';
import '../styles/Home.css';
import TilInteresse from '../components/TilInteresse';

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
                        <li><TilEmne emne='ECON1210' /></li>
                    </ul>
                </div>

                <div className="liste-seksjon">
                    <h2>Interesser:</h2>
                    <ul className="interesse-liste">
                        <li><TilInteresse navn="programmering" /></li>
                        <li><TilInteresse navn="geografi" /></li>
                    </ul>
                </div>
            </div>
        </div>
        </>
    );
}

export default Home;