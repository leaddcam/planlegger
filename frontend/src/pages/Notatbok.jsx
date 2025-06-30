import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {TilNotat, TilNotatblokk, NyttNotat, NyBlokk} from '../components';
import '../styles/Notatbok.css';
// hente notater fra database
import {hentNotater} from '../api/notater';

function Notatbok() {
  console.log("Notatbok-komponenten rendres!");

  const { interesse } = useParams();
  const [løseNotater, settNotat] = useState([]);
  const [notatblokker, settNotatblokker] = useState({});
  // henter lagrede notater fra databasen når komponenten lastes
  useEffect(() => {
    console.log("useEffect aktivert for interesse:", interesse);

    async function hent() {
      try {
        const data = await hentNotater(interesse); // henter alle notater tilknyttet interessen
        // sjekker at funksjonen returnerer notat
        console.log("Alle hentede notater: ", data);
        console.log("Interesse: ", interesse);

        // deler opp i løse og blokk-tilhørende notater
        const løse = data.filter(n => n.blokkId === null);
        const blokker = {};

        data.forEach(notat => {
          if (notat.blokkId === null) {
            løse.push(notat);
          } else {
            if (!blokker[notat.blokkId]) {
              blokker[notat.blokkId] = [];
            }
            blokker[notat.blokkId].push(notat);
          }
        });

        settNotat(løse);
        settNotatblokker(blokker);
      } catch (err) {
        console.error('Feil ved henting av notater:', err);
      }
    }

    hent();
  }, [interesse]);

  return (
    <div>
        <h1>Notatbok for {interesse}</h1>

        <div className="lists-container">
        {/* Løse notater + NyttNotat */}
        <div className="list-wrapper">
            <div className="list-header">
            <h2>Løse sider</h2>
            <NyttNotat settNotat={settNotat} />
            </div>
            <ul className="notat-list">
                {løseNotater.map(n => (
                <li key={n.notatId} className="notat-item">
                    <TilNotat notat={n} blokk={n.blokkId}/>
                </li>
                ))}
            </ul>
        </div>

        {/* Notatblokker + NyBlokk */}
        <div className="list-wrapper">
            <div className="list-header">
            <h2>Seksjoner</h2>
            <NyBlokk blokk={notatblokker} settBlokk={settNotatblokker} interesse={interesse}/>
            </div>
            <ul className="notat-list">
                {Object.entries(notatblokker).map(([blokkNavn, notater]) => (
                <li key={blokkNavn} className="notat-item">
                    <TilNotatblokk notatblokk={blokkNavn} notater={notater}/>
                </li>
                ))}
            </ul>
        </div>
        </div>
    </div>
  );
}


export default Notatbok;
