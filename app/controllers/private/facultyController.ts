import axios from 'axios';
import { Faculty } from './../../models/faculty/faculty';
import { API_ENDPOINTS } from '../../util/conexion/conexion';
export class FacultyController {

    async getAllFaculties(token: string): Promise<Faculty[]> {
        try {
            const response = await axios.get(API_ENDPOINTS.FACULTY_LIST, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return Faculty.fromJSONlist(response.data);
        } catch (error) {
            console.error('Error en getAllFaculties:', error);
            throw error;
        }
    }


}