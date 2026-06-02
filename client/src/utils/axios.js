/* eslint-disable no-unused-vars */
import axios from "axios";

const API = axios.create({

  baseURL:
    `${import.meta.env.VITE_API_URL}api/v1)`,

  withCredentials: true
});



// ======================================
// AUTO REFRESH TOKEN
// ======================================

API.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;



    // TOKEN EXPIRED
    if (

      error.response?.status === 401

      &&

      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        // GET NEW TOKEN
        await axios.post(

          `${import.meta.env.VITE_API_URL}/api/v1/users/refresh-token`,

          {},

          {
            withCredentials: true
          }
        );



        // RETRY ORIGINAL REQUEST
        return API(
          originalRequest
        );

      } catch (refreshError) {

        console.log(
          "Refresh Failed"
        );

        window.location.href =
          "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;