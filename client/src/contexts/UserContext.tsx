import { createContext } from 'react';

interface UserContextType {
  username: string;
  userRole: string | null;
}

export const UserContext = createContext<UserContextType>({
  username: '',
  userRole: null
}); 