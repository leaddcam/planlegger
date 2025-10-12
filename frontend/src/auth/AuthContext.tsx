// src/auth/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';
type User = { id:string; email:string; display_name?:string; email_verified?:boolean } | null;

const Ctx = createContext<{user:User; refresh:()=>Promise<void>}>({ user:null, refresh:async()=>{} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const refresh = async () => { try { const { user } = await api('/api/auth/me'); setUser(user); } catch { setUser(null); } };
  useEffect(() => { refresh(); }, []);
  return <Ctx.Provider value={{ user, refresh }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
