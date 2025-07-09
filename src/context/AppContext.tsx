import React, { createContext, useContext, useReducer } from 'react';
import type { GlobalState, AuthState, ProjectState } from './types';

const storedUser = localStorage.getItem('user');
console.log("stored user", storedUser)
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
      return {
        ...state,
        auth: initialAuthState,
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

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
