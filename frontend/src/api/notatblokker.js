const BASE_URL = 'http://localhost:3000/api/notatblokker';

export async function hentNotatblokk(blokkId) {
  try {
    const respons = await fetch(`http://localhost:3001/api/notatblokker/blokk/${blokkId}`);
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

export async function lagreNotatblokk({ interesse, navn }) {
  const res = await fetch('http://localhost:3000/api/notatblokker/blokk', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ interesse, navn }),
  });

  if (!res.ok) {
    const feil = await res.json();
    throw new Error(feil.melding || 'Kunne ikke lagre notatblokk');
  }

  return res.json(); // { blokkId, navn }
}