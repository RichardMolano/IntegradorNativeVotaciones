
import axios from "axios";
import { interfaceMVC } from "../../models/interfaceMVC";
import { API_ENDPOINTS } from "../../util/conexion/conexion";
import { Candidates } from '../../models/candidates/candidates';




export class CandidatesController {

    async createCandidate(candidate: Candidates[], token: string): Promise<Candidates[]> {
        try {
            const response = await axios.post(API_ENDPOINTS.CANDIDATE_CREATE, candidate, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error en createCandidate:', error);
            throw error;
        }

    }
    async getCandidateById(id: number,token: string): Promise<Candidates | null> {
        try {
            const response = await axios.get(`${API_ENDPOINTS.CANDIDATE_LIST}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return Candidates.fromJSON(response.data);
        } catch (error) {
            console.error('Error en getCandidateById:', error);
            throw error;
        }

    }
    async updateCandidate(candidate: Candidates, token: string): Promise<Candidates> {
        try {
            const response = await axios.put(`${API_ENDPOINTS.CANDIDATE_UPDATE}/${candidate.id}`, candidate, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return Candidates.fromJSON(response.data);
        } catch (error) {
            console.error('Error en updateCandidate:', error);
            throw error;
        }

    }
    async deleteCandidates(ids: number[], election_id: number, token: string): Promise<void> {
        try {
            await axios.post(API_ENDPOINTS.CANDIDATE_DELETE,{ ids, election_id }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error en deleteCandidates:', error);
            throw error;
        }
    }
    async deleteCandidate(id: number, token: string): Promise<void> {
        try {
            await axios.delete(`${API_ENDPOINTS.CANDIDATE_DELETE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error en deleteCandidate:', error);
            throw error;
        }

    }
    async getAllCandidates(token: string): Promise<Candidates[]> {
        try {
            const response = await axios.get(API_ENDPOINTS.CANDIDATE_LIST, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return Candidates.fromJSONlist(response.data);
        } catch (error) {
            console.error('Error en getAllCandidates:', error);
            throw error;
        }

    }

    getCandidatesByElectionId(userId: number, token: string): Promise<any[]> {
        return axios.get(`${API_ENDPOINTS.CANDIDATE_ELECTION}${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Error en getCandidatesByElectionId:', error);
                throw error;
            });
    }

    async updateCandidatesByElectionId(userId: number, charge: string, token: string): Promise<Candidates[]> {
        try {
            const response = await axios.put(`${API_ENDPOINTS.CANDIDATE_UPDATE_STATUS}${userId}`, { charge }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return Candidates.fromJSONlist(response.data);
        } catch (error) {
            console.error('Error en updateCandidatesByElectionId:', error);
            throw error;
        }
    }




}
