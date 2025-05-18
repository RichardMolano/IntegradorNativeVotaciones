import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: string;
  userName: string;
  password: string;
  voted: boolean;
  vote: [string];
  rol: string;
};

type UserContextType = {
  user: User[];
  setUser: React.Dispatch<React.SetStateAction<User[]>>;
};

export const UserContext = createContext<UserContextType>({
  user: [],
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User[]>([]);
  const STORAGE_KEY = "user_guardados";

  useEffect(() => {
    const cargar = async () => {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) setUser(JSON.parse(json));
    };
    cargar();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
