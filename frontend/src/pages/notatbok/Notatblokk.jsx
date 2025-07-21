import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import '../../styles/Notatblokk.css';
import {NyttNotat, TilNotat} from '../../components';
import {hentNotatblokk} from '../../api/notatblokker';
import {hentNotater} from '../../api/notater';

function Notatblokk() {
  const {interesse, blokkId: blokkID} = useParams();
  const [notater, settNotater] = useState([]);
  const [blokkNavn, settBlokkNavn] = useState("");

  useEffect(() => {
    async function hentData() {
      try {
        const alleNotater = await hentNotater(interesse);
        console.log("blokkid:", blokkID);
        const blokkIdNum = Number(blokkID);
        console.log("renset blokkid:", blokkIdNum);
        const blokkNotater = alleNotater.filter(n => n.blokkId === blokkIdNum);
        console.log(blokkNotater);
        settNotater(blokkNotater);

        // feil ved henting fra notatblokker.js
        const blokkInfo = await hentNotatblokk(blokkIdNum);
        settBlokkNavn(blokkInfo.navn);
      } catch (err) {
        console.error('Feil ved henting av data til notatblokk:', err);
      }
    }

    hentData();
  }, [interesse, blokkID]);

  return (
    <div className="notater-container">
      <h1>Blokk: {blokkNavn}</h1>
        <NyttNotat settNotat={settNotater} blokkId={Number(blokkID)} />
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
