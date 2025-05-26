import axios from "axios";
import { interfaceMVC } from "../../models/interfaceMVC";
import { User } from "../../models/user/user";
import { API_ENDPOINTS } from "../../util/conexion/conexion";



export class UserController implements interfaceMVC {
    async createUser(user: User): Promise<User> {
        try {
            const token = localStorage.getItem("TOKEN");
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
    async getUserById(id: number): Promise<User | null> {
        try {
            const token = localStorage.getItem("TOKEN");
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
    async updateUser(user: User): Promise<User> {
        try {
            const token = localStorage.getItem("TOKEN");
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
    async deleteUser(id: number): Promise<void> {
        try {
            const token = localStorage.getItem("TOKEN");
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
    async getAllUsers(): Promise<User[]> {
        try {
        const token = localStorage.getItem("TOKEN"); // replace with your method to get the token
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
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('Contraseña hasheada SHA-512:', hashedPassword);
    return hashedPassword;
};

