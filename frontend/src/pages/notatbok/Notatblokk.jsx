import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import '../../styles/Notatblokk.css';
import {NyttNotat, TilNotat} from '../../components';
import {hentNotatblokk} from '../../api/notatblokker';
import {hentNotater} from '../../api/notater';

function Notatblokk() {
  const {interesse, blokkId} = useParams();
  const [notater, settNotater] = useState([]);
  const [blokkNavn, settBlokkNavn] = useState("");

  useEffect(() => {
    async function hentData() {
      try {
        const alleNotater = await hentNotater(interesse);
        const blokkIdNum = Number(blokkId);
        const blokkNotater = alleNotater.filter(n => n.blokkId === blokkIdNum);
        settNotater(blokkNotater);

        const blokkInfo = await hentNotatblokk(blokkIdNum);
        settBlokkNavn(blokkInfo.navn);
      } catch (err) {
        console.error('Feil ved henting av data til notatblokk:', err);
      }
    }

    hentData();
  }, [interesse, blokkId]);

  return (
    <div className="notater-container">
      <h1>Blokk: {blokkNavn}</h1>
      <NyttNotat settNotat={settNotater} blokk={Number(blokkId)} />
      <ul>
        {notater.map(notat => (
          <li key={notat.notatId}>
            <TilNotat notat={notat} blokk={notat.blokkId} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notatblokk;
