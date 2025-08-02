import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { GlobalState, AuthState, ProjectState } from './types';

const storedUser = localStorage.getItem('user');
const initialAuthState: AuthState = {
  isAuthenticated: !!localStorage.getItem('access_token'),
  user: storedUser ? JSON.parse(storedUser) : null,
  loading: false,
};

const initialProjectState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

const initialState: GlobalState = {
  auth: initialAuthState,
  projects: initialProjectState,
};

type Action =
  | { type: 'SET_AUTH'; payload: AuthState }
  | { type: 'SET_PROJECTS'; payload: ProjectState }
  | { type: 'LOGOUT' };

const reducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        auth: action.payload,
      };
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      return {
        ...state,
        auth: {
          isAuthenticated: false,
          user: null,
          loading: false,
        },
        projects: initialProjectState,
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: GlobalState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ✅ Check token expiry on first load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded: { exp: number } = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          dispatch({ type: 'LOGOUT' });
        } else {
          // Optional: set timeout to auto-logout exactly at expiry
          const timeUntilExpiry = decoded.exp * 1000 - Date.now();
          const logoutTimer = setTimeout(() => {
            dispatch({ type: 'LOGOUT' });
          }, timeUntilExpiry);

          return () => clearTimeout(logoutTimer);
        }
      } catch (err) {
        console.error('Invalid token:', err);
        dispatch({ type: 'LOGOUT' });
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
