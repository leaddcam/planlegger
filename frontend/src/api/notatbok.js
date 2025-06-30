const BASE_URL = 'http://localhost:3000/api/notatbok';

export async function hentNotater(interesse) {
  const res = await fetch(`${BASE_URL}/${interesse}`);
  return res.json();
}

export async function hentNotatMedId(id) {
  const res = await fetch(`${BASE_URL}/id/${id}`);
  if (!res.ok) throw new Error('Kunne ikke hente notat');
  return res.json();
}

export async function lagreNotat({ interesse, tittel, innhold, blokkId }) {
  const renBlokkId = (blokkId && !isNaN(Number(blokkId))) ? Number(blokkId) : null;
  console.log('Lagrer notat med blokkId:', blokkId);
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ interesse, tittel, innhold, blokkId: renBlokkId }),
  });

  if (!res.ok) {
    const feil = await res.json();
    throw new Error(feil.error || 'Kunne ikke lagre notat');
  }
  return res.json();
}

export async function oppdaterNotat(id, { tittel, innhold }) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ tittel, innhold }),
  });

  if (!res.ok) {
    const feil = await res.json();
    throw new Error(feil.error || 'Kunne ikke oppdatere notat');
  }
    return res.json();
}

export async function hentNotatblokk(blokkId) {
  try {
    const respons = await fetch(`http://localhost:3001/api/notater/notatblokk/${blokkId}`);
    if (!respons.ok) {
      throw new Error('Kunne ikke hente notatblokk');
    }
    const data = await respons.json();
    return data;
  } catch (err) {
    console.error('Feil i hentNotatblokk:', err);
    throw err;
  }
}

