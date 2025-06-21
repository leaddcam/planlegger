import {useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import '../styles/Notatblokk.css';
import {NyttNotat} from '../components';

function Notatblokk() {
  const {navn, blokk} = useParams();
  const naviger = useNavigate();
  const [notater, settNotater] = useState([]);

  return (
    <div className="notater-container">
      <h1>Notatblokk for {navn}</h1>
      <ul>
        {notater.map(notat => (
          <li key={notat.id}>
            <button 
              onClick={() => 
                naviger(`/interesse/${navn}/notatbok/blokk/${blokk}/notat/${notat.id}`, 
                {state: {tittel: notat.tittel}})}>
            {notat.tittel}
            </button>
          </li>
        ))}
      </ul>
     <NyttNotat settNotat={settNotater} />
    </div>
  );
}

export default Notatblokk;