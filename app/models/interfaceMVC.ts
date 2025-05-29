import { Elections } from './elections/elections';

import { Role } from "./role/role";
import { Student } from "./student/student";
import { User } from "./user/user";

export interface interfaceMVC {
    createUser(user: User,token: string): Promise<User>;
    getUserById(id: number,token: string): Promise<User | null>;
    updateUser(user: User,token: string): Promise<User>;
    deleteUser(id: number,token: string): Promise<void>;
    getAllUsers(token: string): Promise<User[]>;
}
export interface interfaceMVCRole {
    createRole(role: Role,token: string): Promise<Role>;
    getRoleById(id: number,token: string): Promise<Role | null>;
    updateRole(role: Role,token: string): Promise<Role>;
    deleteRole(id: number,token: string): Promise<void>;
    getAllRoles(token: string): Promise<Role[]>;
}
export interface interfaceMVCStudent {
    createStudent(student: Student,token: string): Promise<Student>;
    getStudentById(id: number,token: string): Promise<Student | null>;
    updateStudent(student: Student,token: string): Promise<Student>;
    deleteStudent(id: number,token: string): Promise<void>;
    getAllStudents(token: string): Promise<Student[]>;
}
export interface interfaceMVCElection {
    createElection(Election: Elections,token: string): Promise<Elections>;
    getElectionById(id: number,token: string): Promise<Elections | null>;
    updateElection(Election: Elections,token: string): Promise<Elections>;
    deleteElection(id: number,token: string): Promise<void>;
    getAllElections(token: string): Promise<Elections[]>;
}

