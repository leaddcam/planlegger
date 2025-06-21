import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

function Notatbok() {
  const { navn } = useParams();

  const [løseNotater, settLøseNotater] = useState([
    { id: 1, tittel: "Introduksjon til AI" },
    { id: 2, tittel: "Plan for semesteret" }
  ]);

  const [notatblokker, settNotatblokker] = useState({
    "Frontend": [
      { id: 3, tittel: "React Grunnkurs" },
      { id: 4, tittel: "Styled Components" }
    ],
    "Backend": [
      { id: 5, tittel: "Node.js intro" }
    ]
  });

  // ➕ Legg til nytt løst notat
  const leggTilLøstNotat = () => {
    const tittel = prompt("Tittel på nytt notat:");
    if (tittel) {
      const nyttNotat = { id: Date.now(), tittel };
      settLøseNotater(prev => [...prev, nyttNotat]);
    }
  };

  // 📁 Legg til ny notatblokk
  const leggTilBlokk = () => {
    const navnPåBlokk = prompt("Navn på ny notatblokk:");
    if (navnPåBlokk && !notatblokker[navnPåBlokk]) {
      settNotatblokker(prev => ({ ...prev, [navnPåBlokk]: [] }));
    }
  };

  return (
    <div>
      <h1>Notatbok for interesse: {navn}</h1>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={leggTilLøstNotat}>➕ Nytt løst notat</button>
        <button onClick={leggTilBlokk} style={{ marginLeft: '1rem' }}>
          📁 Ny notatblokk
        </button>
      </div>

      <h2>Løse notater</h2>
      {løseNotater.length > 0 ? (
        <ul>
          {løseNotater.map(n => (
            <li key={n.id}>
              <Link to={`/interesse/${navn}/notatbok/${n.id}`}>{n.tittel}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Ingen løse notater ennå.</p>
      )}

      <h2>Notatblokker</h2>
      {Object.entries(notatblokker).length > 0 ? (
        Object.entries(notatblokker).map(([blokkNavn, notater]) => (
          <div key={blokkNavn}>
            <h3>
              <Link to={`/interesse/${navn}/notatbok/${blokkNavn}`}>{blokkNavn}</Link>
            </h3>
            {notater.length > 0 ? (
              <ul>
                {notater.map(n => (
                  <li key={n.id}>
                    <Link to={`/interesse/${navn}/notatbok/${blokkNavn}/${n.id}`}>{n.tittel}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p><em>Ingen notater i denne blokken enda.</em></p>
            )}
          </div>
        ))
      ) : (
        <p>Ingen notatblokker ennå.</p>
      )}
    </div>
  );
}

export default Notatbok;
