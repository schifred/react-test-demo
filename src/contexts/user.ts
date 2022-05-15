import { useContext, createContext } from 'react';

type UserContextType = {
  userInfo?: Record<string, any>;
};

const UserContext = createContext<UserContextType>({});

export const UserContextProvider = UserContext.Provider;
export const useUserContext = () => {
  return useContext(UserContext);
};
