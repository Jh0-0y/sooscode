import axios from "axios";

export const codeApi = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    timeout: 5000,
});