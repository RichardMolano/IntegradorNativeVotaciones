import { Candidates } from "../candidates/candidates";
import { Elections } from "../elections/elections";
import { User } from "../user/user";

export class Votes {

    public id_vote: number;
    public candidate: Candidates;
    public user: User;
    public election: Elections;
    public date: Date;
    public state: boolean;

    constructor(id_vote: number, candidate: Candidates, user: User, election: Elections, date: Date, state: boolean) {
        this.id_vote = id_vote;
        this.candidate = candidate;
        this.user = user;
        this.election = election;
        this.date = date;
        this.state = state;
    }
}