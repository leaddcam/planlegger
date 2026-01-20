// page for et valgt Emne

// importerer useParams for å kunne ekstrahere URL parametere
import {useParams} from 'react-router-dom';
import '../styles/Emne.css';
import {TilNotatbok, TilHjem} from '../components';
import InputFelt from '../components/InputFelt'

// emneData: objekt som holder emne-spsifikk data
const emneData = {
  IN2000: {title: 'Prosjektoppgave'},
  IN3240: {title: 'Testing'},
  IN1160: {title: 'Maskinlæring'}
};

function Emne() {
  // bruker useParams hook til å returnere et objekt med den dynamiske delen av URL
  const {emnekode} = useParams(); 

  // sjekker om emnet eksisterer i emneData-objektet
  // returnerer standard melding hvis ikke det eksisterer i emneData
  const current = emneData[emnekode] || {title: emnekode};

  const url = `https://www.uio.no/studier/emner/matnat/ifi/${emnekode}/`;
  const erIFIKode = emnekode.includes("IN");

  return (
    <>
    <TilHjem />
    <div className="emne-container">
      <h1>{current.title}</h1>
      {erIFIKode? (
        <a href={url} target="_blank" rel="noopener noreferrer">
           Emneside
        </a>
      ) : (
        <InputFelt />
      )}
    </div>
    <TilNotatbok />
    </>
  );
}

export default Emne;

