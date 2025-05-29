import { Faculty } from "../faculty/faculty";
import { User } from "../user/user";

export class Student {

    public userStudent?: User;
    public faculty?: Faculty;
    public semester?: number;

    constructor(user?: User, faculty?: Faculty, semester?: number) {

        this.userStudent = user;
        this.faculty = faculty;
        this.semester = semester;
    }

    static fromJSON(json: any): Student {
        return new Student(
            User.fromJSON(json.userStudent),
            Faculty.fromJSON(json.faculty),
            json.semester
        );
    }

}