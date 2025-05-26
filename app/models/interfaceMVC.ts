import { Elections } from './elections/elections';

import { Role } from "./role/role";
import { Student } from "./student/student";
import { User } from "./user/user";

export interface interfaceMVC {
    createUser(user: User): Promise<User>;
    getUserById(id: number): Promise<User | null>;
    updateUser(user: User): Promise<User>;
    deleteUser(id: number): Promise<void>;
    getAllUsers(): Promise<User[]>;
}
export interface interfaceMVCRole {
    createRole(role: Role): Promise<Role>;
    getRoleById(id: number): Promise<Role | null>;
    updateRole(role: Role): Promise<Role>;
    deleteRole(id: number): Promise<void>;
    getAllRoles(): Promise<Role[]>;
}
export interface interfaceMVCStudent {
    createStudent(student: Student): Promise<Student>;
    getStudentById(id: number): Promise<Student | null>;
    updateStudent(student: Student): Promise<Student>;
    deleteStudent(id: number): Promise<void>;
    getAllStudents(): Promise<Student[]>;
}
export interface interfaceMVCElection {
    createElection(Election: Elections): Promise<Elections>;
    getElectionById(id: number): Promise<Elections | null>;
    updateElection(Election: Elections): Promise<Elections>;
    deleteElection(id: number): Promise<void>;
    getAllElections(): Promise<Elections[]>;
}

