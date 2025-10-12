// src/pages/Signup.tsx
import { useState } from 'react';
import { api } from '../api/client';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState(''); const [pwd, setPwd] = useState('');
  const [msg, setMsg] = useState<string|null>(null); const [err, setErr] = useState<string|null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(null); setMsg(null);
    try {
      await api('/api/auth/register', { method:'POST', body: JSON.stringify({ email, password: pwd }) });
      setMsg('Sjekk e-posten din for bekreftelseslenke.');
    } catch (e:any) { setErr(e?.error || 'Noe gikk galt'); }
  };

  return (
    <form onSubmit={submit} style={{maxWidth:360, margin:'4rem auto'}}>
      <h2>Opprett konto</h2>
      {msg && <p>{msg}</p>}
      {err && <p style={{color:'crimson'}}>{err}</p>}
      <input placeholder="E-post" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Passord" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} />
      <button type="submit">Registrer</button>
      <p>Har konto? <Link to="/login">Logg inn</Link></p>
    </form>
  );
}
