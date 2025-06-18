import {useState} from 'react';
import {useParams} from 'react-router-dom';
import '../styles/Notatblokk.css';

function Notatblokk() {
  const {navn} = useParams();
  const [notater, settNotater] = useState([
    {id: 1, tittel: 'react Hooks'},
    {id: 2, tittel: 'Event handling i JSX'}
  ]);

  const leggTilNotat = () => {
    const nyTittel = prompt("Skriv inn tittel for nytt notat: ");
    if (nyTittel) {
      settNotater([...notater, {id: Date.now(), tittel: nyTittel}]);
    }
  };

  return (
    <div className="notater-container">
      <h1>Notater for {navn}</h1>
      <ul>
        {notater.map(notat => (
          <li key={notat.id}>
            <button>{notat.tittel}</button>
          </li>
        ))}
      </ul>
      <button onClick={leggTilNotat} className="legg-til-knapp">+</button>
    </div>
  );
}

export default Notatblokk;