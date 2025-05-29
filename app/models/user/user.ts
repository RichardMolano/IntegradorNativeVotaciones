import { Faculty } from './../faculty/faculty';
import { Student } from '../student/student';
import { Candidates } from "../candidates/candidates";
import { Votes } from "../vote/vote";
import { Role } from "../role/role";

export class User {

    public id: number;
    public name: string;
    public document: string;
    public email: string;
    public password: string;
    public id_role: number;
    public roleUser: Role;

    constructor(id: number, name: string, document: string, email: string, password: string, id_role: number, role: Role) {
        this.id = id;
        this.name = name;
        this.document = document;
        this.email = email;
        this.password = password;
        this.id_role = id_role;
        this.roleUser = role;
    }

    public static fromJSONlist(json: any): User[] {
        return json.map((item: any) => User.fromJSON(item));
    }

    public static fromJSON(json: any): User {
        return new User(
            json.id,
            json.name,
            json.document,
            json.email,
            json.password,
            json.id_role,
            new Role(json.roleUser.id, json.roleUser.name)
        );
    }


}