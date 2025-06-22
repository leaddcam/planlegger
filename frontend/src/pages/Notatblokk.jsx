import {useState} from 'react';
import {useParams} from 'react-router-dom';
import '../styles/Notatblokk.css';
import {NyttNotat, TilNotat} from '../components';

function Notatblokk() {
  const {blokk} = useParams();
  const [notater, settNotater] = useState([]);

  return (
    <div className="notater-container">
      <h1>{blokk}</h1>
      <NyttNotat settNotat={settNotater} />
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