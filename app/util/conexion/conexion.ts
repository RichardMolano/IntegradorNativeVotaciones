
const URL_BASE = "http://localhost:3999";

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
};
