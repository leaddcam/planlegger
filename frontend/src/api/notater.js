// src/api/notater.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const BASE_URL = `${API_BASE}/api/notater`;

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'include',                    // <-- important for cookie auth
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (res.status === 204) return null;

  let data = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    const msg = data?.melding || data?.error || 'ukjent feil';
    // optional: auto-redirect when not logged in
    if (res.status === 401) {
      // window.location.assign('/login');
    }
    throw new Error(msg);
  }
  return data;
}

/**
 * oppretter notat.
 * sender interesse/emne (den andre = null). blokkId valgfri.
 * backend setter user_id fra sesjonen.
 * returnerer: { notatId, melding }
 */
export async function lagreNotat({ tittel, innhold = '', blokkId = null, interesse = null, emne = null }) {
  const body = { tittel, innhold, blokkId, interesse, emne };
  return apiFetch(`${BASE_URL}/`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * henter alle notater for en INTERESSE (kun for innlogget bruker)
 * (backend: GET /api/notater/interesse/:interesse)
 */
export async function hentNotaterForInteresse(interesse) {
  return apiFetch(`${BASE_URL}/interesse/${encodeURIComponent(interesse)}`);
}

/**
 * henter alle notater for et EMNE (kun for innlogget bruker)
 * (backend: GET /api/notater/emne/:emne)
 */
export async function hentNotaterForEmne(emne) {
  return apiFetch(`${BASE_URL}/emne/${encodeURIComponent(emne)}`);
}

/**
 * henter ett notat via id (kun for innlogget bruker)
 */
export async function hentNotatById(id) {
  return apiFetch(`${BASE_URL}/id/${encodeURIComponent(id)}`);
}

/**
 * oppdaterer notat (tittel/innhold)
 */
export async function oppdaterNotat(id, { tittel, innhold }) {
  return apiFetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({ tittel, innhold }),
  });
}

/**
 * sletter notat
 */
export async function slettNotat(notatId) {
  await apiFetch(`${BASE_URL}/${encodeURIComponent(notatId)}`, { method: 'DELETE' });
}
