import { Candidates } from "../candidates/candidates";
import { Votes } from "../vote/vote";

export class Elections {

    public id: number;
    public name: string;
    public codeJoin: string;
    public start_date: Date;
    public end_date: Date;
    public state: boolean;


    constructor(id: number, name: string, codeJoin: string, start_date: Date, end_date: Date, state: boolean, candidatesElections: Candidates[], votesElections: Votes[]) {
        this.id = id;
        this.name = name;
        this.codeJoin = codeJoin;
        this.start_date = start_date;
        this.end_date = end_date;
        this.state = state;
    }

    static fromJSON(json: any): Elections {
        return new Elections(
            json.id,
            json.name,
            json.codeJoin,
            new Date(json.start_date),
            new Date(json.end_date),
            json.state,
            Candidates.fromJSONlist(json.candidatesElections || []),
            Votes.fromJSONlist(json.votesElections || [])
        );
    }
}
