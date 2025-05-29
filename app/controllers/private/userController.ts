import axios from "axios";
import { interfaceMVC } from "../../models/interfaceMVC";
import { User } from "../../models/user/user";
import { API_ENDPOINTS } from "../../util/conexion/conexion";
import * as Crypto from "expo-crypto";
import {useContext} from "react";
import {SeguridadContext} from "../../asyncData/Context";




export class UserController implements interfaceMVC {

    async createUser(user: User ,token: string): Promise<User> {
        try {
            user.password = await hashPasswordSHA512(user.password);
            const response = await axios.post(API_ENDPOINTS.USER_CREATE, user, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return User.fromJSON(response.data);
        } catch (error) {
            console.error('Error en createUser:', error);
            throw error;
        }
    }
    async getUserById(id: number,token: string): Promise<User | null> {
        try {
            const response = await axios.get(`${API_ENDPOINTS.USER_LIST}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return User.fromJSON(response.data);
        } catch (error) {
            console.error('Error en getUserById:', error);
            throw error;
        }
    }
    async updateUser(user: User,token: string): Promise<User> {
        try {
            user.password = await hashPasswordSHA512(user.password);
            const response = await axios.put(`${API_ENDPOINTS.USER_UPDATE}/${user.id}`, user, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return User.fromJSON(response.data);
        } catch (error) {
            console.error('Error en updateUser:', error);
            throw error;
        }
    }
    async deleteUser(id: number,token: string): Promise<void> {
        try {
            await axios.delete(`${API_ENDPOINTS.USER_DELETE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error en deleteUser:', error);
            throw error;
        }
    }
    async getAllUsers(token: string): Promise<User[]> {
        try {

        const response = await axios.get(API_ENDPOINTS.USER_LIST, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            let userlist = User.fromJSONlist(response.data);
            console.log('Response - API:', userlist);
            return userlist;
        } catch (error) {
            console.error('Error en GetAllUsers:', error);
            throw error;
        }
    }
    

}
export const hashPasswordSHA512 = async (password: string): Promise<string> => {
    const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA512,
        password
    );
    console.log('Contraseña hasheada SHA-512:', hashedPassword);
    return hashedPassword;
};

