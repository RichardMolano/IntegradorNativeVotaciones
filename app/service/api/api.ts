// src/services/api.js
import axios from 'axios';
import { User } from '../../models/user/user';
import { API_ENDPOINTS } from '../../util/conexion/conexion';

export const sigIn = async (user :User ) => {
  try {
    const response = await axios.post(API_ENDPOINTS.SESSION, { email: user.email, password: await hashPasswordSHA512(user.password) });
    console.log('Respuesta de la API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en sigIn:', error);
    throw error;
  }
};

export const hashPasswordSHA512 = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('Contraseña hasheada SHA-512:', hashedPassword);
    return hashedPassword;
};
