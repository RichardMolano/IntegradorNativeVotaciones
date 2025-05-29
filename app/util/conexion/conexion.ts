
const URL_BASE = "https://vjp05pvw-3999.use2.devtunnels.ms";

export const API_ENDPOINTS = {
    SESSION: `${URL_BASE}/public/auth/signin`,

    /* User */
    USER_CREATE: `${URL_BASE}/private/user/newUser`,
    USER_LIST: `${URL_BASE}/private/user/findAll`,
    USER_UPDATE: `${URL_BASE}/private/user/update`,
    USER_DELETE: `${URL_BASE}/private/user/delete`,
    USER_FIND: `${URL_BASE}/private/user/findOne/`,
    /* Role */
    ROLE_CREATE: `${URL_BASE}/private/rol/newRole`,
    ROLE_LIST: `${URL_BASE}/private/rol/FindAll`,
    ROLE_UPDATE: `${URL_BASE}/private/rol/updateRole`,
    ROLE_DELETE: `${URL_BASE}/private/rol/deleteRole`,
    ROLE_FIND: `${URL_BASE}/private/rol/findOne/`,
    /* Election */
    ELECTION_CREATE: `${URL_BASE}/private/elections/newElection`,
    ELECTION_LIST: `${URL_BASE}/private/elections/FindAll`,
    ELECTION_UPDATE: `${URL_BASE}/private/elections/update/`,
    ELECTION_DELETE: `${URL_BASE}/private/elections/delete/`,
    ELECTION_FIND: `${URL_BASE}/private/elections/findOne/`,
    ELECTION_RESULTS: `${URL_BASE}/private/elections/getResults`,
    /* Candidate */
    CANDIDATE_CREATE: `${URL_BASE}/private/candidates/newCandidate`,
    CANDIDATE_LIST: `${URL_BASE}/private/candidates/findAll`,
    CANDIDATE_UPDATE: `${URL_BASE}/private/candidates/update/`,
    CANDIDATE_DELETE: `${URL_BASE}/private/candidates/deleteCandidates/`,
    CANDIDATE_FIND: `${URL_BASE}/private/candidates/findOne/`,
    CANDIDATE_FINDUSER: `${URL_BASE}/private/candidates/byUser/`,
    CANDIDATE_ELECTION: `${URL_BASE}/private/candidates/getElectionsByUserId/`,
    CANDIDATE_UPDATE_STATUS: `${URL_BASE}/private/candidates/updateCandidateStatus/`,
    
    /* Vote */
    VOTE_CREATE: `${URL_BASE}/private/votes/newVote`,
    VOTE_LIST: `${URL_BASE}/private/votes/findAll/`,
    VOTE_UPDATE: `${URL_BASE}/private/votes/voteElectionCandidate`,
    VOTE_DELETE: `${URL_BASE}/private/votes/deleteVotes`,
    VOTE_BY_USER: `${URL_BASE}/private/votes/getVotesByUser/`,

    /* Faculty */
    FACULTY_LIST: `${URL_BASE}/private/faculty/findAll`,
    /* Student */
    STUDENT_CREATE: `${URL_BASE}/private/student/newStudent`,


};
