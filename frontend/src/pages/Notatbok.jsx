import { useParams } from 'react-router-dom';
import { useState } from 'react';
import {TilNotat, TilNotatblokk, NyttNotat, NyBlokk} from '../components';

function Notatbok() {
  const { navn } = useParams();
  const [løseNotater, settNotat] = useState([]);
  const [notatblokker, settNotatblokker] = useState({});

  return (
    <div>
      <h1>Notatbok for {navn}</h1>
      <div>
        <NyttNotat settNotat={settNotat} />
        <NyBlokk blokk={notatblokker} settBlokk={settNotatblokker} />
      </div>

      <h2>Løse notater</h2>
      {løseNotater.length > 0 ? (
        <ul>
          {løseNotater.map(n => (
            <li key={n.id}>
              <TilNotat notat={n.tittel} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Ingen løse notater ennå.</p>
      )}

      <h2>Notatblokker</h2>
      {Object.entries(notatblokker).length > 0 ? (
        <ul>
            {Object.entries(notatblokker).map(blokkNavn => (
                <li key={blokkNavn}>
                    <TilNotatblokk notatblokk={blokkNavn} />
                </li>
            ))}
        </ul>
      ) : (
        <p>Ingen notatblokker ennå.</p>
      )}
    </div>
  );
}

export default Notatbok;
