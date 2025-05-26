import { Elections } from './../../models/elections/elections';
import { interfaceMVCElection } from "../../models/interfaceMVC";

export class ElectionController implements interfaceMVCElection {
    createElection(election: Elections): Promise<Elections> {
        throw new Error('Method not implemented.');
    }
    getElectionById(id: number): Promise<Elections | null> {
        throw new Error('Method not implemented.');
    }
    updateElection(election: Elections): Promise<Elections> {
        throw new Error('Method not implemented.');
    }
    deleteElection(id: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getAllElections(): Promise<Elections[]> {
        throw new Error('Method not implemented.');
    }

}