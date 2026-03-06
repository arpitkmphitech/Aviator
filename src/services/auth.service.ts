import API_ENDPOINTS from "@/lib/endpoints";
import {
  IForgotPassword,
  ILoginRequest,
  IRegisterSignUp,
  IResetPassword,
  ISendOtp,
  IVerifyOtp,
} from "@/types/auth";
import { IApiResponse } from "@/types/types";
import axiosInstance from "@/utils/axiosInstance";
import { toFormData } from "axios";

export const sendOtp = async (data: ISendOtp) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.SEND_OTP, data);
  return response as unknown as IApiResponse;
};

export const verifyOtp = async (data: IVerifyOtp) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.VERIFY_OTP,
    data
  );
  return response as unknown as IApiResponse<boolean>;
};

export const registerUser = async (data: IRegisterSignUp) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.REGISTER,
    toFormData(data)
  );
  return response as unknown as IApiResponse;
};

export const forgetPassword = async (data: IForgotPassword) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    data
  );
  return response as unknown as IApiResponse;
};

export const loginUser = async (data: ILoginRequest) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, data);
  return response as unknown as IApiResponse;
};

export const resetPassword = async (data: IResetPassword) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    data
  );
  return response as unknown as IApiResponse;
};

export const getUserDetails = async (data: { userId: string }) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.GET_USER, data);

  return response as unknown as IApiResponse;
};

export const getLuggageList = async () => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.GET_LUGGAGE_LIST
  );
  return response as unknown as IApiResponse;
};
