import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AUTH_SESSION_EVENT, authApi, clearStoredAuth, getStoredAuth, normalizeAuthPayload, setStoredAuth } from '../services/api';

const AuthContext = createContext(null);

const isTransientProfileError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  return error?.status === 0 || error?.name === 'AbortError' || message.includes('timed out');
};

export const AuthProvider = ({ children }) => {
  const storedSession = getStoredAuth();
  const [user, setUser] = useState(storedSession?.user ?? null);
  const [accessToken, setAccessToken] = useState(storedSession?.accessToken ?? null);
  const [refreshToken, setRefreshToken] = useState(storedSession?.refreshToken ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = Boolean(user && accessToken);

  const syncSession = useCallback((session) => {
    if (!session) {
      clearStoredAuth();
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      return null;
    }

    const nextSession = {
      user: session.user ?? null,
      accessToken: session.accessToken ?? null,
      refreshToken: session.refreshToken ?? null,
    };

    setStoredAuth(nextSession);
    setUser(nextSession.user);
    setAccessToken(nextSession.accessToken);
    setRefreshToken(nextSession.refreshToken);
    return nextSession;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleAuthSessionChange = (event) => {
      const session = event?.detail ?? null;
      if (!session) {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        return;
      }

      setUser(session.user ?? null);
      setAccessToken(session.accessToken ?? null);
      setRefreshToken(session.refreshToken ?? null);
    };

    window.addEventListener(AUTH_SESSION_EVENT, handleAuthSessionChange);
    return () => window.removeEventListener(AUTH_SESSION_EVENT, handleAuthSessionChange);
  }, []);

  const bootstrap = useCallback(async () => {
    const stored = getStoredAuth();
    if (!stored?.accessToken && !stored?.refreshToken) {
      setIsLoading(false);
      return;
    }

    try {
      if (stored?.user) {
        syncSession(stored);
      }

      const profile = await authApi.profile();
      syncSession({
        ...stored,
        user: profile,
      });
    } catch (error) {
      if (stored && isTransientProfileError(error)) {
        syncSession(stored);
      } else {
        syncSession(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [syncSession]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (credentials) => {
    const payload = await authApi.login(credentials);
    const session = normalizeAuthPayload(payload);
    syncSession(session);
    return payload;
  }, [syncSession]);

  const register = useCallback(async (payload) => {
    return authApi.register(payload);
  }, []);

  const logout = useCallback(async () => {
    const stored = getStoredAuth();
    try {
      if (stored?.refreshToken) {
        await authApi.logout(stored.refreshToken);
      }
    } catch {
      // Clear client state even if the server-side logout request fails.
    } finally {
      syncSession(null);
    }
  }, [syncSession]);

  const refreshProfile = useCallback(async () => {
    const profile = await authApi.profile();
    syncSession({
      ...getStoredAuth(),
      user: profile,
    });
    return profile;
  }, [syncSession]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isLoading,
      isAuthenticated: Boolean(user && accessToken),
      login,
      register,
      logout,
      refreshProfile,
      setSession: syncSession,
    }),
    [accessToken, isAuthenticated, isLoading, login, logout, refreshProfile, register, refreshToken, syncSession, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
