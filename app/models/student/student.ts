import { Faculty } from "../faculty/faculty";
import { User } from "../user/user";

export class Student {

    public user: User;
    public faculty: Faculty;
    public semester: number;

    constructor(user: User, faculty: Faculty, semester: number) {
        this.user = user;
        this.faculty = faculty;
        this.semester = semester;
    }

}