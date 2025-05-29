// src/services/api.js
import axios from 'axios';
import { User } from '../../models/user/user';
import { API_ENDPOINTS } from '../../util/conexion/conexion';
import * as Crypto from 'expo-crypto';

export const sigIn = async (user :User ) => {
  try {
      console.log('sitio requiest:', API_ENDPOINTS.SESSION);
    const response = await axios.post(API_ENDPOINTS.SESSION, { email: user.email, password: await hashPasswordSHA512(user.password) });
    console.log('Respuesta de la API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en sigIn:', error);
    throw error;
  }
};



export const hashPasswordSHA512 = async (password: string): Promise<string> => {
    const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA512,
        password
    );
    console.log('Contraseña hasheada SHA-512:', hashedPassword);
    return hashedPassword;
};

