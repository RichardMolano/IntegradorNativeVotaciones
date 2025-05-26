import { Candidates } from "../candidates/candidates";
import { Votes } from "../vote/vote";

export class Elections {

    public id: number;
    public name: string;
    public start_date: Date;
    public end_date: Date;
    public state: boolean;


    constructor(id: number, name: string, start_date: Date, end_date: Date, state: boolean, candidatesElections: Candidates[], votesElections: Votes[]) {
        this.id = id;
        this.name = name;
        this.start_date = start_date;
        this.end_date = end_date;
        this.state = state;
    }
}
