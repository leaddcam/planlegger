import {useParams, useLocation} from 'react-router-dom';
import {useState} from 'react';

function NotatSide() {
  const {navn} = useParams();
  const location = useLocation();
  const tittel = location.state?.tittel;

  return (
    <div>
      <h1>Notat for {tittel ? tittel : "Ukjent notat"}</h1>
      <textarea placeholder="Skriv inn notatet her..." />
    </div>
  );
}

export default NotatSide;
