import { Role } from './../../models/role/role';
import axios from "axios";
import { interfaceMVCRole } from "../../models/interfaceMVC";
import { API_ENDPOINTS } from "../../util/conexion/conexion";

// Removed: import { Role } from 'react-native';

export class RoleController implements interfaceMVCRole {
    async createRole(role: Role): Promise<Role> {
        try {
            const response = await axios.post(API_ENDPOINTS.ROLE_CREATE, role);
            return response.data as Role;
        } catch (error) {
            throw new Error(`Failed to create role: ${error}`);
        }
    }

    async getRoleById(id: number): Promise<Role | null> {
        try {
            const response = await axios.get(`${API_ENDPOINTS.ROLE_FIND}/${id}`);
            return response.data as Role;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw new Error(`Failed to get role by id: ${error}`);
        }
    }

    async updateRole(role: Role): Promise<Role> {
        try {
            const response = await axios.put(`${API_ENDPOINTS.ROLE_UPDATE}/${role.id}`, role);
            return response.data as Role;
        } catch (error) {
            throw new Error(`Failed to update role: ${error}`);
        }
    }

    async deleteRole(id: number): Promise<void> {
        try {
            await axios.delete(`${API_ENDPOINTS.ROLE_DELETE}/${id}`);
        } catch (error) {
            throw new Error(`Failed to delete role: ${error}`);
        }
    }

    async getAllRoles(): Promise<Role[]> {
        try {
            const token = localStorage.getItem("TOKEN");
            const response = await axios.get(API_ENDPOINTS.ROLE_LIST, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return Role.fromJSONlist(response.data);
        } catch (error) {
            throw new Error(`Failed to get all roles: ${error}`);
        }
    }
}

