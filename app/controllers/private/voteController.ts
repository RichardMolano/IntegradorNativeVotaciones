import { Candidates } from './../../models/candidates/candidates';
import axios from "axios";
import { Votes } from "../../models/vote/vote";
import { API_ENDPOINTS } from "../../util/conexion/conexion";
import { Elections } from '../../models/elections/elections';

export class VoteController {
    async create(vote: Votes[], token: string): Promise<Votes[]> {
        try {
            const response = await axios.post(`${API_ENDPOINTS.VOTE_CREATE}`, vote, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error('Error en createVote:', error);
            throw error;
        }
    }

    async getByElectionId(id_election: number, token: string): Promise<[Candidates[], Votes[]]> {
        try {
            const response = await axios.get(`${API_ENDPOINTS.VOTE_LIST}${id_election}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Extraemos los candidatos y votos de acuerdo a la estructura proporcionada
            const candidates = response.data.Candidates || [];
            const votes = response.data.votes || [];
            return [candidates, votes];
        } catch (error) {
            console.error('Error en getVotes:', error);
            throw error;
        }
    }
    async getVoteByUser(userId: number, token: string): Promise<[any[]]> {
        try {
            const response = await axios.get(`${API_ENDPOINTS.VOTE_BY_USER}${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = response.data as any[];

            return [data];
        } catch (error) {
            console.error('Error en getVotes:', error);
            throw error;
        }
    }
    async getElectionVotesByMethod(candidateId: number, voteId: number, token: string): Promise<Votes[]> {
        try {
            const response = await axios.put(
                `${API_ENDPOINTS.VOTE_UPDATE}`, { candidateId, voteId }, { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data as Votes[];
        } catch (error) {
            console.error('Error en getElectionVotesByMethod:', error);
            throw error;
        }
    }

    async deleteVotes(voteIds: number[], election: number, token: string): Promise<any> {
        try {
            const response = await axios.post(`${API_ENDPOINTS.VOTE_DELETE}`, { voteIds, election_id: election }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error('Error en deleteVotes:', error);
            throw error;
        }
    }
    async voteElectionCandidate(voteId: number, candidateId: number, token: string): Promise<any> {
        try {
            const response = await axios.put(
                `${API_ENDPOINTS.VOTE_UPDATE}`,
                { cod: voteId, cand_id: candidateId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('Error en voteElectionCandidate:', error);
            throw error;
        }
    }
}
