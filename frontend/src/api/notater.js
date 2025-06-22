const BASE_URL = 'http://localhost:3000/api/notater';

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
}
