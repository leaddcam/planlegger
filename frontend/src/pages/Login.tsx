// src/pages/Login.tsx
import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState(''); const [pwd, setPwd] = useState('');
  const [err, setErr] = useState<string|null>(null);
  const { refresh } = useAuth(); const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(null);
    try {
      await api('/api/auth/login', { method:'POST', body: JSON.stringify({ email, password: pwd }) });
      await refresh(); nav('/home');
    } catch (e:any) { setErr(e?.error || 'Innlogging feilet'); }
  };

  return (
    <form onSubmit={submit} style={{maxWidth:360, margin:'4rem auto'}}>
      <h2>Logg inn</h2>
      {err && <p style={{color:'crimson'}}>{err}</p>}
      <input placeholder="E-post" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Passord" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} />
      <button type="submit">Logg inn</button>
      <p>Ingen konto? <Link to="/signup">Opprett konto</Link></p>
    </form>
  );
}
