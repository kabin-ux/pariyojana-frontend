import { useCallback } from 'react';
import { useAppContext } from './AppContext';
import type { User, Project } from './types';

export const useAuth = () => {
  const { state: { auth }, dispatch } = useAppContext();

  const login = useCallback((user: User) => {
    dispatch({
      type: 'SET_AUTH',
      payload: {
        isAuthenticated: true,
        user,
        loading: false,
      },
    });
  }, [dispatch]);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    dispatch({ type: 'LOGOUT' });
  }, [dispatch]);

  return {
    ...auth,
    login,
    logout,
  };
};

export const useProjects = () => {
  const { state: { projects }, dispatch } = useAppContext();

  const setProjects = useCallback((projectList: Project[]) => {
    dispatch({
      type: 'SET_PROJECTS',
      payload: {
        projects: projectList,
        loading: false,
        error: null,
      },
    });
  }, [dispatch]);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({
      type: 'SET_PROJECTS',
      payload: {
        ...projects,
        loading,
      },
    });
  }, [dispatch, projects]);

  const setError = useCallback((error: string | null) => {
    dispatch({
      type: 'SET_PROJECTS',
      payload: {
        ...projects,
        error,
        loading: false,
      },
    });
  }, [dispatch, projects]);

  return {
    ...projects,
    setProjects,
    setLoading,
    setError,
  };
};
