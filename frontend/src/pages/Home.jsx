import React from 'react';
import EmneKnapp from '../components/EmneKnapp';
import '../styles/Home.css';
import InteresseKnapp from '../components/InteresseKnapp';

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
                        <li><EmneKnapp emne='IN2010' /></li>
                        <li><EmneKnapp emne='IN2031' /></li>
                        <li><EmneKnapp emne='IN2090' /></li>
                        <li><EmneKnapp emne='IN2120' /></li>
                        <li><EmneKnapp emne='ECON1210' /></li>
                    </ul>
                </div>

                <div className="liste-seksjon">
                    <h2>Interesser:</h2>
                    <ul className="interesse-liste">
                        <li><InteresseKnapp navn="programmering" /></li>
                        <li><InteresseKnapp navn="geografi" /></li>
                    </ul>
                </div>
            </div>
        </div>
        </>
    );
}

export default Home;