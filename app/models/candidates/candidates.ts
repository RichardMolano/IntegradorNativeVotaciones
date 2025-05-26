import { Student } from '../studient/studient';
import { Elections } from './../elections/elections';
export class Candidates {

    public id: number;
    public elections: Elections;
    public student: Student;
    public proposals: string;

    constructor(id: number, elections: Elections, student: Student, proposals: string) {
        this.id = id;
        this.elections = elections;
        this.student = student;
        this.proposals = proposals;
    }
}