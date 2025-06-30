import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import '../styles/Notatblokk.css';
import {NyttNotat, TilNotat} from '../components';
import {hentNotater, hentNotatblokk} from '../api/notatbok';

function Notatblokk() {
  const {interesse, blokk} = useParams();
  const [notater, settNotater] = useState([]);
  const [blokkNavn, settBlokkNavn] = useState("");

  useEffect(() => {
    async function hentData() {
      try {
        const alleNotater = await hentNotater(interesse);
        const blokkId = Number(blokk);
        const blokkNotater = alleNotater.filter(n => n.blokkId === blokkId);
        settNotater(blokkNotater);

        const blokkInfo = await hentNotatblokk(blokkId);
        settBlokkNavn(blokkInfo.navn);
      } catch (err) {
        console.error('Feil ved henting av data til notatblokk:', err);
      }
    }

    hentData();
  }, [interesse, blokk]);

  return (
    <div className="notater-container">
      <h1>Blokk: {blokkNavn}</h1>
      <NyttNotat settNotat={settNotater} blokk={Number(blokk)} />
      <ul>
        {notater.map(notat => (
          <li key={notat.id}>
            <TilNotat notat={notat} blokk={notat.blokkId} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notatblokk;
