import { API_BASE_URL } from "@/lib/config";
// import { refreshToken } from "@/services/auth.service";
import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.lang = "en";
    config.headers.role = "consumer";
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  async (response) => {
    const data = response.data;
    if (data?.isSuccess) {
      return data;
    } else {
      if (
        !data?.isSuccess &&
        response.status !== 401 &&
        response.status !== 433
      ) {
        return Promise.reject(data);
      } else {
        if (response.status === 433 || response.status === 401) {
          try {
            // const res = await refreshToken();
            // if (res?.data?.isSuccess) {
            //   Cookies.set("token", res?.data?.data?.token, {
            //     expires: 7,
            //     path: "/",
            //     sameSite: "lax",
            //   });
            //   return axiosInstance(response.config);
            // } else {
            //   Cookies.remove("token", {
            //     path: "/",
            //     sameSite: "lax",
            //   });
            //   window.location.href = `${BASE_PATH}/login`;
            // }
          } catch (error) {
            // Cookies.remove("token", {
            //   path: "/",
            //   sameSite: "lax",
            // });
            // window.location.href = `${BASE_PATH}/login`;
          }
        } else {
          return Promise.reject(data);
        }
      }
    }
  },
  async (error) => {
    const { response } = error;
    if (response) {
      const { data } = response;
      if (
        !data?.isSuccess &&
        response.status !== 401 &&
        response.status !== 433
      ) {
        if (data) {
          return Promise.reject(data);
        } else {
          return Promise.reject({
            message: error?.message,
          });
        }
      } else {
        if (response.status === 433 || response.status === 401) {
          try {
            // const res = await refreshToken();
            // if (res?.data?.isSuccess) {
            //   Cookies.set("token", res?.data?.data?.token, {
            //     expires: 7,
            //     path: "/",
            //     sameSite: "lax",
            //   });
            //   return axiosInstance(response.config);
            // } else {
            //   Cookies.remove("token", {
            //     path: "/",
            //     sameSite: "lax",
            //   });
            //   window.location.href = `${BASE_PATH}/login`;
            // }
          } catch (error) {
            // Cookies.remove("token", {
            //   path: "/",
            //   sameSite: "lax",
            // });
            // window.location.href = `${BASE_PATH}/login`;
          }
        } else {
          return Promise.reject(data);
        }
      }
    } else {
      return Promise.reject({
        message: "Network error try again",
      });
    }
  }
);

export default axiosInstance;
