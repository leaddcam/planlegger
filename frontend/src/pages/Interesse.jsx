// page for en Interesse

import {useParams} from 'react-router-dom';
import '../styles/Interesse.css';
import {TilNotatbok, TilHjem} from '../components';



function Interesse() {
  const {navn} = useParams(); 
  return (
    <>
    <TilHjem />
    <div className="interesse-side">
        <h1 className="navn">{navn}</h1>
        <TilNotatbok />
    </div>
    </>
  );
}

export default Interesse;