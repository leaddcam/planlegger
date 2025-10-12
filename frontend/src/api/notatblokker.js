// src/api/notatblokker.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const BASE_URL = `${API_BASE}/api/notatblokker`;

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'include',                    // <-- important for cookie auth
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (res.status === 204) return null;

  // try to parse json (even on error)
  let data = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    const msg = data?.melding || data?.error || 'ukjent feil';
    // optional: auto-redirect when not logged in
    if (res.status === 401) {
      // window.location.assign('/login'); // uncomment if you want auto redirect
    }
    throw new Error(msg);
  }
  return data;
}

/**
 * henter én notatblokk
 * @returns {Promise<object>} { blokkId, interesse|null, emne|null, navn, opprettelsesdato, antall_notater, user_id }
 */
export async function hentNotatblokk(blokkId) {
  return apiFetch(`${BASE_URL}/blokk/${encodeURIComponent(blokkId)}`);
}

/**
 * oppretter notatblokk (enten interesse ELLER emne) + navn
 * backend setter user_id fra sesjonen
 * @returns {Promise<object>} hele raden inkl. "blokkId"
 */
export async function lagreNotatblokk({ interesse = null, emne = null, navn }) {
  const body = { interesse, emne, navn };
  return apiFetch(`${BASE_URL}/blokk`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * øker antall_notater med 1 for en blokk (server validerer user_id)
 */
export async function oppdaterAntallNotater(blokkId) {
  return apiFetch(`${BASE_URL}/oppdater-antall/${encodeURIComponent(blokkId)}`, {
    method: 'POST',
  });
}

/**
 * henter alle blokker for en gitt interesse (kun for innlogget bruker)
 */
export async function hentNotatblokkerForInteresse(interesse) {
  return apiFetch(`${BASE_URL}/blokker/${encodeURIComponent(interesse)}`);
}

/**
 * henter alle blokker for et gitt emne (kun for innlogget bruker)
 */
export async function hentNotatblokkerForEmne(emne) {
  return apiFetch(`${BASE_URL}/blokker/emne/${encodeURIComponent(emne)}`);
}

/**
 * sletter notatblokk (og tilhørende notater slettes i backend)
 */
export async function slettNotatblokk(blokkId) {
  await apiFetch(`${BASE_URL}/${encodeURIComponent(blokkId)}`, { method: 'DELETE' });
}
