// Secure Axios Instance With Authentication Token Injection
import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

// Create Axios Instance With Base Configuration
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Request Interceptor To Attach Authorization Token
    const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
      if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    });

    // Response Interceptor To Handle Auth Errors
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const statusCode = error?.response?.status;

        // Force Logout On Unauthorized Or Forbidden
        if (statusCode === 401 || statusCode === 403) {
          try {
            await logOut();
            navigate("/login");
          } catch (logoutError) {
            console.error("Logout Failed:", logoutError);
          }
        }

        return Promise.reject(error);
      },
    );

    // Cleanup Interceptors On Unmount
    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
