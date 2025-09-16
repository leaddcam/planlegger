import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TilNotat, TilNotatblokk, NyttNotat, NyBlokk, Oversikt } from '../../components';
import '../../styles/Notatbok.css';

// bruker de oppdaterte API-funksjonene
import {
  hentNotaterForInteresse,
  hentNotaterForEmne,
  slettNotat,
} from '../../api/notater';

import {
  hentNotatblokkerForInteresse,
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

        // 2) Hent notatblokker KUN når vi er på interesse-siden
        const blokker = interesse
          ? await hentNotatblokkerForInteresse(interesse)
          : [];

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
            // notatet tilhører en blokk vi ikke har (kan skje på emne-siden)
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

  // Hjelpeverdier for props til NyttNotat / NyBlokk
  // (send begge — backend krever at bare én av dem faktisk har verdi)
  const interesseProp = interesse ?? null;
  const emneProp = emnekode ?? null;

  return (
    <div>
      <Oversikt />
      <h1>
        Notatbok for {interesseProp ?? emneProp}
      </h1>

      <div className="lists-container">
        {/* Løse notater + NyttNotat */}
        <div className="list-wrapper">
          <div className="list-header">
            <h2>Løse sider</h2>
            {/* NyttNotat må sende enten interesse ELLER emne i body */}
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

        {/* Notatblokker + NyBlokk (vises bare når vi er på interesse-siden) */}
        {interesseProp && (
          <div className="list-wrapper">
            <div className="list-header">
              <h2>Seksjoner</h2>
              {/* NyBlokk oppretter blokk for en interesse */}
              <NyBlokk
                blokk={notatblokker}
                settBlokk={settNotatblokker}
                interesse={interesseProp}
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
        )}
      </div>
    </div>
  );
}

export default Notatbok;
