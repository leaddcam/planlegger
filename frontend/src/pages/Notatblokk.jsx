import {useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import '../styles/Notatblokk.css';

function Notatblokk() {
  const {navn} = useParams();
  const naviger = useNavigate();
  const [notater, settNotater] = useState([
    {id: 1, tittel: 'MySQL'},
    {id: 2, tittel: 'Algoritmer'},
    {id: 3, tittel: 'Portfolio'}
  ]);

  const leggTilNotat = () => {
    const nyTittel = prompt("Skriv inn tittel for nytt notat: ");
    if (nyTittel) {
      settNotater([...notater, nyttNotat]);
    }
  };

  return (
    <div className="notater-container">
      <h1>Notatblokk for {navn}</h1>
      <ul>
        {notater.map(notat => (
          <li key={notat.id}>
            <button onClick={() => naviger(`/interesse/${navn}/notater/${notat.id}`, {state: {tittel: notat.tittel}})}>
              {notat.tittel}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={leggTilNotat} className="legg-til-knapp">+</button>
    </div>
  );
}

export default Notatblokk;