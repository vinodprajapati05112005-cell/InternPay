import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, clearStoredAuth, getStoredAuth, normalizeAuthPayload, setStoredAuth } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
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
    } catch {
      syncSession(null);
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
