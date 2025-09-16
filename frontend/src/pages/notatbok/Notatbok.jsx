import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TilNotat, TilNotatblokk, NyttNotat, NyBlokk, Oversikt } from '../../components';
import '../../styles/Notatbok.css';

// Notater-API
import {
  hentNotaterForInteresse,
  hentNotaterForEmne,
  slettNotat,
} from '../../api/notater';

// Notatblokker-API
import {
  hentNotatblokkerForInteresse,
  hentNotatblokkerForEmne,   // ⬅️ NY
  slettNotatblokk,
} from '../../api/notatblokker';

function Notatbok() {
  // Router kan gi enten { interesse } eller { emnekode }
  const { interesse, emnekode } = useParams();

  const [løseNotater, settLøseNotater] = useState([]);
  const [notatblokker, settNotatblokker] = useState({});

  useEffect(() => {
    async function hentData() {
      try {
        // 1) Hent notater for enten interesse ELLER emne
        const notater = interesse
          ? await hentNotaterForInteresse(interesse)
          : await hentNotaterForEmne(emnekode);

        // 2) Hent notatblokker for interesse ELLER emne
        const blokker = interesse
          ? await hentNotatblokkerForInteresse(interesse)
          : await hentNotatblokkerForEmne(emnekode);

        // bygg opp struktur for blokker
        const blokkerMedNotater = {};
        blokker.forEach((blokk) => {
          blokkerMedNotater[blokk.blokkId] = {
            navn: blokk.navn,
            notater: [],
          };
        });

        // del opp notater i løse vs. blokk-tilhørende
        const løse = [];
        notater.forEach((notat) => {
          if (notat.blokkId === null || notat.blokkId === undefined) {
            løse.push(notat);
          } else if (blokkerMedNotater[notat.blokkId]) {
            blokkerMedNotater[notat.blokkId].notater.push(notat);
          } else {
            // notatet tilhører en blokk vi ikke har (f.eks. inkonsistens)
            løse.push(notat);
          }
        });

        settLøseNotater(løse);
        settNotatblokker(blokkerMedNotater);
      } catch (err) {
        console.error('Feil ved henting av data til notatbok:', err);
      }
    }

    hentData();
  }, [interesse, emnekode]);

  // Props til NyttNotat / NyBlokk (send begge; backend krever at bare én faktisk har verdi)
  const interesseProp = interesse ?? null;
  const emneProp = emnekode ?? null;

  return (
    <div>
      <Oversikt />
      <h1>Notatbok for {interesseProp ?? emneProp}</h1>

      <div className="lists-container">
        {/* Løse notater + NyttNotat */}
        <div className="list-wrapper">
          <div className="list-header">
            <h2>Løse sider</h2>
            <NyttNotat
              settNotat={settLøseNotater}
              interesse={interesseProp}
              emne={emneProp}
            />
          </div>

          <ul className="notat-list">
            {løseNotater.map((n) => (
              <li key={n.notatId} className="notat-item">
                <TilNotat notat={n} blokk={n.blokkId} />
                <button
                  onClick={async () => {
                    try {
                      await slettNotat(n.notatId);
                      settLøseNotater((prev) =>
                        prev.filter((x) => x.notatId !== n.notatId)
                      );
                    } catch (err) {
                      console.error('Feil ved sletting av notat:', err);
                    }
                  }}
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Notatblokker + NyBlokk — nå for både interesse og emne */}
        <div className="list-wrapper">
          <div className="list-header">
            <h2>Seksjoner</h2>
            <NyBlokk
              blokk={notatblokker}
              settBlokk={settNotatblokker}
              interesse={interesseProp}
              emne={emneProp} 
            />
          </div>

          <ul className="notat-list">
            {Object.entries(notatblokker).map(([blokkID, { navn }]) => (
              <li key={blokkID} className="notat-item">
                <TilNotatblokk blokkNavn={navn} blokkId={blokkID} />
                <button
                  onClick={async () => {
                    try {
                      await slettNotatblokk(blokkID);
                      settNotatblokker((prev) => {
                        const ny = { ...prev };
                        delete ny[blokkID];
                        return ny;
                      });
                    } catch (err) {
                      console.error('Feil ved sletting av notatblokk:', err);
                    }
                  }}
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Notatbok;
