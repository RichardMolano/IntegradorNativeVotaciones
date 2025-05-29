import { Student } from './../../models/student/student';
import axios from "axios";
import { API_ENDPOINTS } from "../../util/conexion/conexion";

export class StudentController  {
    async createStudent(student: Student, token: string): Promise<Student> {
        try {
            const response = await axios.post(API_ENDPOINTS.STUDENT_CREATE, student, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error en createStudent:', error);
            throw error;
        }
    }
}