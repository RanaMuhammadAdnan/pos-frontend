import { atom } from 'jotai';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const authAtom = atom<AuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
});

export const userAtom = atom(
  (get) => get(authAtom).user,
  (get, set, user: User | null) => {
    set(authAtom, {
      ...get(authAtom),
      user,
      isAuthenticated: !!user,
    });
  }
);

export const isAuthenticatedAtom = atom(
  (get) => get(authAtom).isAuthenticated,
  (get, set, isAuthenticated: boolean) => {
    set(authAtom, {
      ...get(authAtom),
      isAuthenticated,
    });
  }
);

export const authLoadingAtom = atom(
  (get) => get(authAtom).isLoading,
  (get, set, isLoading: boolean) => {
    set(authAtom, {
      ...get(authAtom),
      isLoading,
    });
  }
);

export const authErrorAtom = atom(
  (get) => get(authAtom).error,
  (get, set, error: string | null) => {
    set(authAtom, {
      ...get(authAtom),
      error,
    });
  }
); 