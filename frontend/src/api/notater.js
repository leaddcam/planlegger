const BASE_URL = 'http://localhost:3000/api/notater';

export async function hentNotater(interesse) {
  console.log("Kaller API for:", `${BASE_URL}/${interesse}`);
  try {
    const res = await fetch(`${BASE_URL}/${interesse}`);
    
    if (!res.ok) {
      console.error("Feil fra serveren:", res.status, await res.text());
      return [];
    }

    const json = await res.json();
    console.log("JSON mottatt:", json);
    return json;
  } catch (err) {
    console.error("Feil under fetch:", err);
    return [];
  }
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




