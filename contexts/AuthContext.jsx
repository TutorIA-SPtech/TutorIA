import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearStoredAuth, getStoredAuth, saveStoredAuth } from '../services/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initializationError, setInitializationError] = useState('');

  const restoreAuth = useCallback(async () => {
    setIsLoading(true);
    setInitializationError('');

    try {
      setAuth(await getStoredAuth());
    } catch {
      setInitializationError('Não foi possível recuperar sua sessão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreAuth();
  }, [restoreAuth]);

  const signIn = useCallback(async (credentials) => {
    await saveStoredAuth(credentials);
    setAuth(credentials);
  }, []);

  const signOut = useCallback(async () => {
    await clearStoredAuth();
    setAuth(null);
  }, []);

  const value = useMemo(() => ({
    auth,
    isLoading,
    initializationError,
    retryAuthRestore: restoreAuth,
    signIn,
    signOut,
  }), [auth, initializationError, isLoading, restoreAuth, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de AuthProvider.');
  }

  return context;
}
