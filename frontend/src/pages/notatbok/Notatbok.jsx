import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {TilNotat, TilNotatblokk, NyttNotat, NyBlokk, Oversikt} from '../../components';
import '../../styles/Notatbok.css';
// hente notater fra database
import {hentNotater} from '../../api/notater';
import {hentNotatblokker} from '../../api/notatblokker';

function Notatbok() {
  const { interesse } = useParams();
  const [løseNotater, settLøseNotater] = useState([]);
  const [notatblokker, settNotatblokker] = useState({});
  
  // henter lagrede notater fra databasen når komponenten lastes
  useEffect(() => {
    async function hentData() {
      try {
        const notater = await hentNotater(interesse);
        const blokker = await hentNotatblokker(interesse);

        // deler opp i løse og blokk-tilhørende notater
        const løse = [];
        const blokkerMedNotater = {};

        blokker.forEach(blokk => {
          blokkerMedNotater[blokk.blokkId] = {
            navn: blokk.navn,
            notater: []
          };
        });

        notater.forEach(notat => {
          if (notat.blokkId === null) {
            løse.push(notat);
          } else if (blokkerMedNotater[notat.blokkId]) {
            blokkerMedNotater[notat.blokkId].notater.push(notat);
          }
        });

        settLøseNotater(løse);
        settNotatblokker(blokkerMedNotater);
      } catch (err) {
        console.error('Feil ved henting av data til notatbok:', err);
      }
    }

    hentData();
  }, [interesse]);

  return (
    <div>
      <Oversikt />
      <h1>Notatbok for {interesse}</h1>

      <div className="lists-container">

        {/* Løse notater + NyttNotat */}
        <div className="list-wrapper">
          <div className="list-header">
            <h2>Løse sider</h2>
            <NyttNotat settNotat={settLøseNotater} interesse={interesse}/>
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
            {Object.entries(notatblokker).map(([blokkID, { navn }]) => (
              <li key={blokkID} className="notat-item">
                <TilNotatblokk blokkNavn={navn} blokkId={blokkID}/>
              </li>
            ))}
        </ul>
      </div>
    </div>
  </div>
  );
}


export default Notatbok;
