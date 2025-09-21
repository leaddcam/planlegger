import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/Notatblokk.css';
import { NyttNotat, TilNotat, UtAvBlokk } from '../../components';

import { hentNotatblokk } from '../../api/notatblokker';
import { hentNotaterForInteresse, hentNotaterForEmne } from '../../api/notater';

function Notatblokk() {
  const { interesse, emnekode, blokkId } = useParams();
  const blokkIdNum = Number(blokkId);

  const [notater, settNotater] = useState([]);
  const [blokkNavn, settBlokkNavn] = useState('');
  const [laster, settLaster] = useState(true);
  const [feil, settFeil] = useState(null);

  const iInteresseKontekst = Boolean(interesse);
  const iEmneKontekst = Boolean(emnekode);

  useEffect(() => {
    let aktiv = true;

    async function hentData() {
      try {
        settLaster(true);
        settFeil(null);

        const [alleNotater, blokkInfo] = await Promise.all([
          iInteresseKontekst
            ? hentNotaterForInteresse(interesse)
            : hentNotaterForEmne(emnekode),
          hentNotatblokk(blokkIdNum),
        ]);

        if (!aktiv) return;

        // filter: notater i denne blokken
        const iDenneBlokken = alleNotater.filter(
          (n) => Number(n.blokkId) === blokkIdNum
        );

        settNotater(iDenneBlokken);
        settBlokkNavn(blokkInfo?.navn || '');
      } catch (err) {
        if (!aktiv) return;
        console.error('Feil ved henting av data til notatblokk:', err);
        settFeil('Kunne ikke hente data');
      } finally {
        if (aktiv) settLaster(false);
      }
    }

    if (!Number.isNaN(blokkIdNum) && (iInteresseKontekst || iEmneKontekst)) {
      hentData();
    }

    return () => {
      aktiv = false;
    };
  }, [interesse, emnekode, blokkIdNum, iInteresseKontekst, iEmneKontekst]);

  return (
    <>
      <UtAvBlokk />
      <div className="notater-container">
        <h1>Blokk: {blokkNavn || 'Ukjent blokk'}</h1>

        <div className="knapper">
          {/* når du oppretter nytt notat i en blokk:
             - setter interesse ELLER emne (den andre = null)
             - bruker blokkId = blokkIdNum
          */}
          <NyttNotat
            interesse={iInteresseKontekst ? interesse : null}
            emne={iEmneKontekst ? emnekode : null}
            blokkId={blokkIdNum}
            settNotat={settNotater}
          />
        </div>

        {laster && <p>Laster…</p>}
        {feil && <p style={{ color: 'red' }}>{feil}</p>}

        {!laster && !feil && (
          <ul>
            {notater.map((notat) => (
              <li key={notat.notatId}>
                <TilNotat notat={notat} blokkId={blokkIdNum} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default Notatblokk;
