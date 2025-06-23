const URL = 'http://localhost:3000/api/notatbok';

// GET lagrede notater for en interesse fra backend
export async function hentLøseNotater(interesse) {
  // api-kall til backend
  const res = await fetch(`${URL}?interesse=${encodeURIComponent(interesse)}&type=løs`,
    {method: 'GET'});
  // sjekker om responsens ok-felt er true eller false
  if (!res.ok) throw new Error('Kunne ikke hente løse notater');
  // parser svaret fra backend som JSON og returnerer det
  return await res.json();
}



// GET lagrede blokker med notater
export async function hentBlokknotater(interesse, blokk) {

}

// POST til backend nye notater lagt til i browser av bruker
export async function lagreLøseNotater() {

}

// POST til backend nye blokker med notater --"--
export async function lagreBlokknotater() {

}

// PATCH til backend endrede notater 
export async function endreLøsnotat() {

}

// PATCH til backend endrede blokknotater
export async function endreBlokknotat() {

}












/*
export async function hentNotater(interesse) {
  const res = await fetch(`${BASE_URL}/${interesse}`);
  return res.json();
}

export async function hentNotatMedId(id) {
  const res = await fetch(`${BASE_URL}/id/${id}`);
  if (!res.ok) throw new Error('Kunne ikke hente notat');
  return res.json();
}

export async function lagreNotat({ interesse, tittel, innhold, blokk = null }) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ interesse, tittel, innhold, blokk }),
  });

  if (!res.ok) throw new Error('Kunne ikke lagre notat');
  return res.json();
}

export async function oppdaterNotat(id, { tittel, innhold }) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tittel, innhold }),
  });

  if (!res.ok) throw new Error('Kunne ikke oppdatere notat');
  return res.json();
} */
