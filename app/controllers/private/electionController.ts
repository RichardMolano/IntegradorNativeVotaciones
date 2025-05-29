import { Elections } from './../../models/elections/elections';
import { interfaceMVCElection } from "../../models/interfaceMVC";
import { API_ENDPOINTS } from '../../util/conexion/conexion';
import axios from 'axios';
import {SeguridadContext, SeguridadProvider} from "../../asyncData/Context";
import {useContext} from "react";

export class ElectionController implements interfaceMVCElection {
    async createElection(election: Elections ,token: string): Promise<Elections> {
        try {
            const response = await axios.post(API_ENDPOINTS.ELECTION_CREATE, election, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data as Elections;
            
        } catch (error) {
            throw new Error(`Failed to create election: ${error}`);
        }
    }
    async getElectionById(id: number,token: string): Promise<Elections | null> {
        try {
            const response = await axios.get(`${API_ENDPOINTS.ELECTION_FIND}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data as Elections;
        } catch (error) {
            throw new Error(`Failed to get election by ID: ${error}`);
        }
    }
    async updateElection(election: Elections,token: string): Promise<Elections> {
        try {
            const response = await axios.put(`${API_ENDPOINTS.ELECTION_UPDATE}/${election.id}`, election, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data as Elections;
        } catch (error) {
            throw new Error(`Failed to update election: ${error}`);
        }
    }
    async deleteElection(id: number,token: string): Promise<void> {
        try {
            await axios.delete(`${API_ENDPOINTS.ELECTION_DELETE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            throw new Error(`Failed to delete election: ${error}`);
        }
    }
    async getAllElections(token: string): Promise<Elections[]> {
        try {
            const response = await axios.get(API_ENDPOINTS.ELECTION_LIST, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data as Elections[];
        } catch (error) {
            throw new Error(`Failed to get all elections: ${error}`);
        }
    }


    async getCandidateElections(electionId: number, token: string): Promise<any[]> {
        try {
            const response = await axios.get(`${API_ENDPOINTS.CANDIDATE_ELECTION}/${electionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data as any[];
        } catch (error) {
            throw new Error(`Failed to get candidate elections: ${error}`);
        }
    }
    async getResultsByElections(electionId: number, token: string): Promise<any[]> {
    try {
        const response = await axios.get(`${API_ENDPOINTS.ELECTION_RESULTS}/${electionId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data as any[];
    } catch (error) {
        throw new Error(`Failed to get results by election: ${error}`);
    }
}
}