// page for en Interesse

import {useParams} from 'react-router-dom';
import '../styles/Interesse.css';
import {TilNotatbok} from '../components';



function Interesse() {
  // bruker useParams hook til å returnere et objekt med den dynamiske delen av URL
  const {navn} = useParams(); 
  // klikker interesseknapp --> blir tatt til /interesse/{navn}
  // en side med en NotatKnapp

  return (
    <div className="interesse-side">
        <h1>{navn}</h1>
        <TilNotatbok />
    </div>
  );
}

export default Interesse;