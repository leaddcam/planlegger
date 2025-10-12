// page for en Interesse

import {useParams} from 'react-router-dom';
import '../styles/Interesse.css';
import {TilNotatbok, TilHjem} from '../components';



function Interesse() {
  const {interesse} = useParams(); 
  return (
    <>
    <TilHjem />
    <div className="interesse-side">
        <h1 className="navn">{interesse}</h1>
        <TilNotatbok />
    </div>
    </>
  );
}

export default Interesse;