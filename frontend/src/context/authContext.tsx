'use client';
import { useContext, createContext, useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { UserType } from '@/type/type';
import { toast } from 'sonner';

export const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserType>();
  const { replace } = useRouter();

  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      await fetchAPI('/auth/login', 'POST', { email, password });
      const user = await fetchAPI('/user/me', 'GET');
      setUserInfo(user);
      setIsAuth(true);
      replace('/');
    } catch (err) {
      setIsAuth(false);
      setUserInfo(undefined);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(String(err));
      }
    } finally {
      setAuthLoading(false);
    }
  };
  const logout = async () => {
    await fetchAPI('/auth/logout', 'POST');
    setIsAuth(false);
    setUserInfo(undefined);
    replace('/login');
  };

  useEffect(() => {
    //Refresh thì sẽ cập nhật lại access_token
    const tryRefresh = async () => {
      setAuthLoading(true);
      try {
        await fetchAPI('/auth/refresh', 'POST');
        const user = await fetchAPI('/user/me', 'GET');
        if (user) {
          setIsAuth(true);
          setUserInfo(user);
        } else {
          setIsAuth(false);
          setUserInfo(undefined);
        }
      } catch (err) {
        setIsAuth(false);
        setUserInfo(undefined);
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error(String(err));
        }
      } finally {
        setAuthLoading(false);
      }
    };
    tryRefresh();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, login, logout, userInfo, setUserInfo, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
