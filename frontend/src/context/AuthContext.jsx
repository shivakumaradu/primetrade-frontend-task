import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

// ─── Context & Initial State ─────────────────────────────────────────────────
const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // true on mount while we validate stored token
  error: null,
};

// ─── Reducer ─────────────────────────────────────────────────────────────────
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return { ...initialState, isLoading: false };

    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'LOADING_DONE':
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

// ─── Provider ────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Persist token & user to localStorage
  const persistAuth = (token, user) => {
    localStorage.setItem('taskflow_token', token);
    localStorage.setItem('taskflow_user', JSON.stringify(user));
  };

  const clearAuth = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
  };

  // ─── Initialize: validate stored token on app load ───────────────────────
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      const storedUser = localStorage.getItem('taskflow_user');

      if (!storedToken) {
        dispatch({ type: 'LOADING_DONE' });
        return;
      }

      try {
        // Validate token with server
        const { data } = await authAPI.getMe();
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: data.data.user,
            token: storedToken,
          },
        });
      } catch {
        // Token is invalid or expired
        clearAuth();
        dispatch({ type: 'LOADING_DONE' });
      }
    };

    initAuth();
  }, []);

  // ─── Actions ─────────────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    dispatch({ type: 'AUTH_START' });
    const { data } = await authAPI.register({ name, email, password });
    const { token, user } = data.data;
    persistAuth(token, user);
    dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } });
    return data;
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    const { data } = await authAPI.login({ email, password });
    const { token, user } = data.data;
    persistAuth(token, user);
    dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } });
    return data;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateUser = useCallback((updatedFields) => {
    dispatch({ type: 'UPDATE_USER', payload: updatedFields });
    // Update localStorage
    const current = JSON.parse(localStorage.getItem('taskflow_user') || '{}');
    localStorage.setItem('taskflow_user', JSON.stringify({ ...current, ...updatedFields }));
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    register,
    login,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
