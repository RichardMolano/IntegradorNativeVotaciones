import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { User } from "../models/user/user";
import { Role } from "../models/role/role";

export type DatoSesion = User;

type SeguridadContextType = {
  sesion: DatoSesion;
  token: string;
  verificarSesion: () => Promise<boolean>;
  cerrarSesion: () => Promise<void>;
  guardarToken: (token: string) => Promise<void>;
  isAuthenticated: boolean;
};

const inicializarSesion = (): DatoSesion =>
  ({
    id: 0,
    name: "",
    email: "",
    document: "",
    password: "",
    roleUser: new Role(0, ""),
  } as DatoSesion);

export const SeguridadContext = createContext<SeguridadContextType>({
  sesion: inicializarSesion(),
  token: "",
  guardarToken: async () => {},
  cerrarSesion: async () => {},
  verificarSesion: async () => false,
  isAuthenticated: false,
});

export const SeguridadProvider = ({ children }: { children: ReactNode }) => {
  const [sesion, setSesion] = useState<DatoSesion>(inicializarSesion);
  const [token, setToken] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const STORAGE_KEY = "TOKEN";

  useEffect(() => {
    const cargar = async () => {
      const tokenGuardado = await AsyncStorage.getItem(STORAGE_KEY);
      if (tokenGuardado) {
        await guardarToken(tokenGuardado);
        setIsAuthenticated(true);
      }
    };
    cargar();
  }, []);

  const guardarToken = async (nuevoToken: string) => {
    try {
      const decoded: any = jwtDecode(nuevoToken);
      const nuevaSesion: DatoSesion = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        document: "",
        password: "",
        id_role: decoded.id_role,
        roleUser: new Role(decoded.role.id, decoded.role.name),
      };
      setToken(nuevoToken);
      setSesion(nuevaSesion);
      setIsAuthenticated(true);
      await AsyncStorage.setItem(STORAGE_KEY, nuevoToken);
    } catch (error) {
      console.error("Token inválido:", error);
      setIsAuthenticated(false);
    }
  };

  const cerrarSesion = async () => {
    setToken("");
    setSesion(inicializarSesion());
    setIsAuthenticated(false);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const verificarSesion = async (): Promise<boolean> => {
    const tokenGuardado = await AsyncStorage.getItem(STORAGE_KEY);
    if (!tokenGuardado) {
      setIsAuthenticated(false);
      return false;
    }
    try {
      const decoded: any = jwtDecode(tokenGuardado);
      const nuevaSesion: DatoSesion = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        document: "",
        password: "",
        id_role: decoded.id_role,
        roleUser: new Role(decoded.role.id, decoded.role.name),
      };
      setToken(tokenGuardado);
      setSesion(nuevaSesion);
      setIsAuthenticated(true);
      return true;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  };

  return (
    <SeguridadContext.Provider
      value={{
        sesion,
        token,
        guardarToken,
        cerrarSesion,
        verificarSesion,
        isAuthenticated,
      }}
    >
      {children}
    </SeguridadContext.Provider>
  );
};
