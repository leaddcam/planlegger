import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {TilNotat, TilNotatblokk, NyttNotat, NyBlokk, Oversikt} from '../../components';
import '../../styles/Notatbok.css';
// hente notater fra database
import {hentNotater, slettNotat} from '../../api/notater';
import {hentNotatblokker, slettNotatblokk} from '../../api/notatblokker';

function Notatbok() {
  const { interesse } = useParams();
  const { emnekode } = useParams();
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
            <NyttNotat settNotat={settLøseNotater} interesse={interesse} />
          </div>
          <ul className="notat-list">
            {løseNotater.map(n => (
              <li key={n.notatId} className="notat-item">
                  <TilNotat notat={n} blokk={n.blokkId}/>
                  {/* knapp for å slette et løst notat */}
                  <button onClick={async () => {
                    try {
                      await slettNotat(n.notatId);
                      settLøseNotater(prev => prev.filter(notat => notat.notatId !== n.notatId));
                    } catch (err) {
                      console.error('Feil ved sletting av notat:', err);
                    }
                  }}>🗑</button>
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
                <button onClick={async () => {
                  try {
                    await slettNotatblokk(blokkID);
                    settNotatblokker(prev => {
                      const ny = {...prev};
                      delete ny[blokkID];
                      return ny;
                    });
                  } catch (err) {
                    console.error('Feil ved sletting av notatblokk:', err);
                  }
                }}>🗑</button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  </div>
  );
}


export default Notatbok;
