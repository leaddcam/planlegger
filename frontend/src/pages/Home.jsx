// hjemmesiden

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
                        {/* endre slik at bruker kan legge inn emner selv */}
                        <li><TilEmne emne='IN2000' /></li>
                        <li><TilEmne emne='IN3240' /></li>
                        <li><TilEmne emne='IN1160' /></li>
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