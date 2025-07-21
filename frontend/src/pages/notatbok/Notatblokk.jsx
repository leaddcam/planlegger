import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import '../../styles/Notatblokk.css';
import {NyttNotat, TilNotat, UtAvBlokk} from '../../components';
import {hentNotatblokk} from '../../api/notatblokker';
import {hentNotater} from '../../api/notater';

function Notatblokk() {
  const {interesse, blokkId} = useParams();
  const blokkIdNum = Number(blokkId);

  const [notater, settNotater] = useState([]);
  const [blokkNavn, settBlokkNavn] = useState("");

  useEffect(() => {
    async function hentData() {
      try {
        const [alleNotater, blokkInfo] = await Promise.all([
          hentNotater(interesse),
          hentNotatblokk(blokkIdNum)
        ]);
        settNotater(alleNotater.filter(n => n.blokkId === blokkIdNum));
        settBlokkNavn(blokkInfo.navn);
      } catch (err) {
        console.error('Feil ved henting av data til notatblokk:', err);
      }
    }

    if (interesse && !isNaN(blokkIdNum)) {
      hentData();
    }
  }, [interesse, blokkIdNum]);

  return (
    <>
    <UtAvBlokk />
    <div className="notater-container">
      <h1>Blokk: {blokkNavn || "Ukjent blokk"}</h1>
        <div className="knapper">
          <NyttNotat interesse={interesse} settNotat={settNotater} blokkId={blokkIdNum} />
        </div>
      <ul>
        {notater.map(notat => (
          <li key={notat.notatId}>
            <TilNotat notat={notat} blokkId={blokkIdNum} />
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default Notatblokk;
