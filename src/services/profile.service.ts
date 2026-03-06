import API_ENDPOINTS from "@/lib/endpoints";
import { IChangePassword, IContactUs, IEditProfile } from "@/types/auth";
import { IApiResponse } from "@/types/types";
import axiosInstance from "@/utils/axiosInstance";
import { toFormData } from "axios";

export const changePassword = async (data: IChangePassword) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.PROFILE.CHANGE_PASSWORD,
    data
  );
  return response as unknown as IApiResponse;
};

export const contactUs = async (data: IContactUs) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.PROFILE.CONTACT_US,
    data
  );
  return response as unknown as IApiResponse;
};

export const updateProfile = async (data: IEditProfile) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.PROFILE.UPDATE_PROFILE,
    toFormData(data)
  );
  return response as unknown as IApiResponse;
};

export const updateLanguage = async (data: IEditProfile) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.PROFILE.CHANGE_LANGUAGE,
    data
  );
  return response as unknown as IApiResponse;
};

export const getAviatorList = async (data: any) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.PROFILE.AVAITER_LIST,
    data
  );
  return response as unknown as IApiResponse;
};

export const getTransactionHistory = async (data: any) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.PROFILE.TRANSACTION_HISTORY,
    data
  );
  return response as unknown as IApiResponse;
};

export const getCharterList = async (data: any) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.PROFILE.CHARTER_LIST,
    data
  );
  return response as unknown as IApiResponse;
};
