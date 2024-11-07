import axios from "axios";

const API_BASE_URL = "https://dev-project-ecommerce.upgrad.dev/api/";

const apiService = axios.create({
    baseURL: API_BASE_URL,
});

const createHeaders = (additionalHeaders = {}) => ({
    "Content-Type": "application/json",
    ...additionalHeaders,
});
// YOUR_COPIED_TOKEN_HERE
const token = "";
const getAuthToken = () => token;

const authenticatedHeaders = () =>
    createHeaders({
        "x-auth-token": `${getAuthToken()}`,
    });

const post_data = (endpoint, data, headers = {}) => {
    return apiService.post(endpoint, data, { headers: createHeaders(headers) });
};

const get_data = (endpoint, params = {}) => {
    return apiService.get(endpoint, {
        params,
        headers: authenticatedHeaders(),
    });
};

const get_login = (endpoint) => {
    return apiService.get(endpoint, { headers: authenticatedHeaders() });
};

const post_login = (endpoint, data) => {
    return apiService.post(endpoint, data, { headers: authenticatedHeaders() });
};

const put_login = (endpoint, data) => {
    return apiService.put(endpoint, data, { headers: authenticatedHeaders() });
};

const delete_login = (endpoint) => {
    return apiService.delete(endpoint, { headers: authenticatedHeaders() });
};

const login_post_data = (endpoint, { username, password }) => {
    const credentials = btoa(`${username}:${password}`);
    return apiService.post(
        endpoint,
        {},
        {
            headers: createHeaders({ Authorization: `Basic ${credentials}` }),
        }
    );
};

const logData = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    return token ? { token, role } : null;
};

export {
    logData,
    post_data,
    login_post_data,
    get_data,
    get_login,
    post_login,
    put_login,
    delete_login,
};
