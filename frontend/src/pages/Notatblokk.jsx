import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import '../styles/Notatblokk.css';
import {NyttNotat, TilNotat} from '../components';
import {hentNotater} from '../api/notater';

function Notatblokk() {
  const {navn, blokk} = useParams();
  const [notater, settNotater] = useState([]);

    useEffect(() => {
    async function hent() {
      try {
        const alleNotater = await hentNotater(navn);
        const blokkNotater = alleNotater.filter(n => n.blokk === blokk);
        settNotater(blokkNotater);
      } catch (err) {
        console.error('Feil ved henting av notater:', err);
      }
    }

    hent();
  }, [navn, blokk]);


  return (
    <div className="notater-container">
      <h1>{blokk}</h1>
      <NyttNotat settNotat={settNotater} blokk={blokk} />
      <ul>
        {notater.map(notat => (
          <li key={notat.id}>
            <TilNotat notat={notat.tittel} blokk={blokk}/>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notatblokk;