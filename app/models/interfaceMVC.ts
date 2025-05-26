
import { Role } from "./role/role";
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

