import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/Notatblokk.css';
import { NyttNotat, TilNotat, UtAvBlokk } from '../../components';

import { hentNotatblokk } from '../../api/notatblokker';
import { hentNotaterForInteresse } from '../../api/notater';

function Notatblokk() {
  const { interesse, blokkId } = useParams();
  const blokkIdNum = Number(blokkId);

  const [notater, settNotater] = useState([]);
  const [blokkNavn, settBlokkNavn] = useState('');
  const [laster, settLaster] = useState(true);
  const [feil, settFeil] = useState(null);

  useEffect(() => {
    let aktiv = true;

    async function hentData() {
      try {
        settLaster(true);
        settFeil(null);

        const [alleNotater, blokkInfo] = await Promise.all([
          hentNotaterForInteresse(interesse),
          hentNotatblokk(blokkIdNum),
        ]);

        if (!aktiv) return;

        // Filtrer til notater i denne blokken
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

    if (interesse && !Number.isNaN(blokkIdNum)) {
      hentData();
    }

    return () => {
      aktiv = false;
    };
  }, [interesse, blokkIdNum]);

  return (
    <>
      <UtAvBlokk />
      <div className="notater-container">
        <h1>Blokk: {blokkNavn || 'Ukjent blokk'}</h1>

        <div className="knapper">
          {/* Når du oppretter nytt notat i en blokk for en interesse:
             - send interesse
             - emne = null
             - blokkId = blokkIdNum
          */}
          <NyttNotat
            interesse={interesse}
            emne={null}
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
