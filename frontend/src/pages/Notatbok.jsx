import { useParams } from 'react-router-dom';
import { useState } from 'react';
import {TilNotat, TilNotatblokk, NyttNotat, NyBlokk} from '../components';
import '../styles/Notatbok.css';

function Notatbok() {
  const { navn } = useParams();
  const [løseNotater, settNotat] = useState([]);
  const [notatblokker, settNotatblokker] = useState({});

  return (
    <div>
        <h1>Notatbok for {navn}</h1>

        <div className="lists-container">
        {/* Left side: Løse notater + NyttNotat */}
        <div className="list-wrapper">
            <div className="list-header">
            <h2>Løse sider</h2>
            <NyttNotat settNotat={settNotat} />
            </div>

            {løseNotater.length > 0 ? (
            <ul className="notat-list">
                {løseNotater.map(n => (
                <li key={n.id} className="notat-item">
                    <TilNotat notat={n.tittel} />
                </li>
                ))}
            </ul>
            ) : (
            <p>Ingen løse notater ennå.</p>
            )}
        </div>

        {/* Right side: Notatblokker + NyBlokk */}
        <div className="list-wrapper">
            <div className="list-header">
            <h2>Seksjoner</h2>
            <NyBlokk blokk={notatblokker} settBlokk={settNotatblokker} />
            </div>

            {Object.entries(notatblokker).length > 0 ? (
            <ul className="notat-list">
                {Object.entries(notatblokker).map(([blokkNavn]) => (
                <li key={blokkNavn} className="notat-item">
                    <TilNotatblokk notatblokk={blokkNavn} />
                </li>
                ))}
            </ul>
            ) : (
            <p>Ingen notatblokker ennå.</p>
            )}
        </div>
        </div>
    </div>
  );
}


export default Notatbok;
