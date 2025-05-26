import { User } from "../user/user";

export class Role {

    public id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
    public static fromJSONlist(json: any): Role[] {
        return json.map((item: any) => Role.fromJSON(item));
    }
    public static fromJSON(json: any): Role {
        return new Role(
            json.id,
            json.name
        );
    }

}