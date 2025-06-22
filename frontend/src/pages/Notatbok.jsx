import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {TilNotat, TilNotatblokk, NyttNotat, NyBlokk} from '../components';
import '../styles/Notatbok.css';
// hente notater fra database
import {hentNotater} from '../api/notater';

function Notatbok() {
  const { navn } = useParams();
  const [løseNotater, settNotat] = useState([]);
  const [notatblokker, settNotatblokker] = useState({});
  // henter lagrede notater fra databasen når komponenten lastes
  useEffect(() => {
    async function hent() {
      try {
        const data = await hentNotater(navn); // henter alle notater tilknyttet interessen
        // sjekker at funksjonen returnerer notat
        console.log("Alle hentede notater: ", data);

        // deler opp i løse og blokk-tilhørende notater
        const løse = [];
        const blokker = {};

        data.forEach(notat => {
          if (!notat.blokk) {
            løse.push(notat);
          } else {
            if (!blokker[notat.blokk]) {
              blokker[notat.blokk] = [];
            }
            blokker[notat.blokk].push(notat);
          }
        });

        settNotat(løse);
        settNotatblokker(blokker);
      } catch (err) {
        console.error('Feil ved henting av notater:', err);
      }
    }

    hent();
  }, [navn]);

  return (
    <div>
        <h1>Notatbok for {navn}</h1>

        <div className="lists-container">
        {/* Løse notater + NyttNotat */}
        <div className="list-wrapper">
            <div className="list-header">
            <h2>Løse sider</h2>
            <NyttNotat settNotat={settNotat} />
            </div>
            <ul className="notat-list">
                {løseNotater.map(n => (
                <li key={n.id} className="notat-item">
                    <TilNotat notat={n.tittel} />
                </li>
                ))}
            </ul>
        </div>

        {/* Notatblokker + NyBlokk */}
        <div className="list-wrapper">
            <div className="list-header">
            <h2>Seksjoner</h2>
            <NyBlokk blokk={notatblokker} settBlokk={settNotatblokker} />
            </div>
            <ul className="notat-list">
                {Object.entries(notatblokker).map(([blokkNavn]) => (
                <li key={blokkNavn} className="notat-item">
                    <TilNotatblokk notatblokk={blokkNavn} />
                </li>
                ))}
            </ul>
        </div>
        </div>
    </div>
  );
}


export default Notatbok;
