// import axios from "axios";
// import { getToken } from "./auth/keycloak.ts";
//
// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:9090", // your Spring Boot backend
// });
//
// // Attach Keycloak token to each request
// api.interceptors.request.use(async (config) => {
//     const token = await getToken();
//     if (token && config.headers) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });
//
// export default api;

