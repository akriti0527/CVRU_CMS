import axios from "axios";

// 1. Create an isolated axios instance
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag tracker and queue to manage overlapping simultaneous requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/* =======================================================
   2. REQUEST INTERCEPTOR: Inject Access Token Automatically
   ======================================================= */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =======================================================
   3. RESPONSE INTERCEPTOR: Handle Expired Access Tokens (401)
   ======================================================= */
apiClient.interceptors.response.use(
  (response) => response, // Pass successful requests directly through
  async (error) => {
    const originalRequest = error.config;

    // Check if the server returned a 401 and this request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Prevent infinite loops if the refresh token endpoint itself returns a 401
      if (originalRequest.url === "/auth/refresh") {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // If a token refresh operation is already running, wait in line
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const localRefreshToken = localStorage.getItem("refreshToken");

        // Request a brand new access token from the backend
        // Note: If using httpOnly cookies, pass { withCredentials: true } instead of a body payload
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/refresh-token`, {
          refreshToken: localRefreshToken,
        });

        const { accessToken, refreshToken } = response.data;

        // Save the fresh keys
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        // Process any other requests that were waiting for the new token
        processQueue(null, accessToken);
        
        // Retry the original failed request with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        isRefreshing = false;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // If the refresh token is completely dead/expired, wipe everything and force login
        console.error("Refresh token expired. Routing to login screen...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;