import { Student } from '../student/student';
import { Elections } from './../elections/elections';
export class Candidates {

    public id: number;
    public electionsCandidates: Elections;
    public id_user: number;
    public userStudent: Student;
    public proposals: string;

    constructor(id: number, id_user: number, elections: Elections, student: Student, proposals: string) {
        this.id = id;
        this.id_user = id_user;
        this.electionsCandidates = elections;
        this.userStudent = student;
        this.proposals = proposals;
    }
    static fromJSON(json: any): Candidates {
        return new Candidates(
            json.id,
            json.id_user,
            json.electionsCandidates,
            json.userStudent,
            json.proposals
        );
    }
    static fromJSONlist(jsonList: any[]): Candidates[] {
        return jsonList.map(json => Candidates.fromJSON(json));
    }
}