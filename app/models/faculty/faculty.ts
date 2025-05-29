import { Student } from '../student/student';

export class Faculty {

    public id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    static fromJSON(json: any): Faculty {
        return new Faculty(
            json.id,
            json.name
        );
    }

    static fromJSONlist(json: any[]): Faculty[] {
        return json.map(item => Faculty.fromJSON(item));
    }
}
