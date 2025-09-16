// src/api/notatblokker.js
const BASE_URL = 'http://localhost:3000/api/notatblokker';

async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = 'Ukjent feil';
    try { const j = await res.json(); msg = j.melding || j.error || msg; } catch {}
    throw new Error(msg);
  }
  // No content
  if (res.status === 204) return null;
  return res.json();
}

/**
 * Hent én notatblokk
 * @returns {Promise<object>} f.eks. { blokkId, interesse|null, emne|null, navn, opprettelsesdato, antall_notater }
 */
export async function hentNotatblokk(blokkId) {
  return apiFetch(`${BASE_URL}/blokk/${encodeURIComponent(blokkId)}`);
}

/**
 * Opprett notatblokk
 * Send *enten* interesse ELLER emne (den andre settes til null) + navn
 * @returns {Promise<object>} hele raden inkl. "blokkId"
 */
export async function lagreNotatblokk({ interesse = null, emne = null, navn }) {
  const body = { interesse, emne, navn };
  return apiFetch(`${BASE_URL}/blokk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/**
 * Hent alle blokker for en gitt interesse
 * (matcher backend: GET /api/notatblokker/blokker/:interesse)
 */
export async function hentNotatblokkerForInteresse(interesse) {
  return apiFetch(`${BASE_URL}/blokker/${encodeURIComponent(interesse)}`);
}

/**
 * Slett notatblokk (og tilhørende notater slettes i backend)
 */
export async function slettNotatblokk(blokkId) {
  await apiFetch(`${BASE_URL}/${encodeURIComponent(blokkId)}`, { method: 'DELETE' });
}
