// src/api/notater.js
const BASE_URL = 'http://localhost:3000/api/notater';

async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    // prøver å hente feilmelding fra backend
    let msg = 'Ukjent feil';
    try { const j = await res.json(); msg = j.melding || j.error || msg; } catch {}
    // logger rå respons ved behov
    // console.error('API-feil', res.status, await res.text().catch(()=>''));
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

/**
 * oppretter notat.
 * sender interesse/emne (den andre = null). blokkId valgfri.
 * returnerer: { notatId, melding }
 */
export async function lagreNotat({ tittel, innhold = '', blokkId = null, interesse = null, emne = null }) {
  const body = { tittel, innhold, blokkId, interesse, emne };
  return apiFetch(`${BASE_URL}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * henter alle notater for en INTERESSE
 * (backend: GET /api/notater/interesse/:interesse)
 */
export async function hentNotaterForInteresse(interesse) {
  return apiFetch(`${BASE_URL}/interesse/${encodeURIComponent(interesse)}`);
}

/**
 * henter alle notater for et EMNE
 * (backend: GET /api/notater/emne/:emne)
 */
export async function hentNotaterForEmne(emne) {
  return apiFetch(`${BASE_URL}/emne/${encodeURIComponent(emne)}`);
}

// henter ett notat via ID
export async function hentNotatById(id) {
  return apiFetch(`${BASE_URL}/id/${encodeURIComponent(id)}`);
}

// oppdaterer notat (tittel/innhold)
export async function oppdaterNotat(id, { tittel, innhold }) {
  return apiFetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tittel, innhold }),
  });
}

// sletter notat
export async function slettNotat(notatId) {
  await apiFetch(`${BASE_URL}/${encodeURIComponent(notatId)}`, { method: 'DELETE' });
}
