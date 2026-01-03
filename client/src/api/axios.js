import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

/**
 * Attach token ONLY for protected routes
 */
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Do NOT attach token for login/register
    if (
      token &&
      !config.url.includes("/auth/login") &&
      !config.url.includes("/auth/register")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
