import React from 'react';
import { SuperAuthContext, useSuperAuthState } from '@/hooks/useSuperAuth';

interface SuperAuthProviderProps {
  children: React.ReactNode;
}

export function SuperAuthProvider({ children }: SuperAuthProviderProps) {
  const authState = useSuperAuthState();

  return (
    <SuperAuthContext.Provider value={authState}>
      {children}
    </SuperAuthContext.Provider>
  );
}