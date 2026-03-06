import API_ENDPOINTS from "@/lib/endpoints";
import { IApiResponse } from "@/types/types";
import axiosInstance from "@/utils/axiosInstance";
import { toFormData } from "axios";

export const getWishlist = async (data: any) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.WISHLIST.GET_WISHLIST,
    data
  );
  return response as unknown as IApiResponse;
};

export const getWishFlightOffers = async (data: any) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.WISHLIST.WISH_FLIGHT_OFFER,
    data
  );
  return response as unknown as IApiResponse;
};

export const updateBidRequestStatus = async (
  data: FormData | { status: string; bidId: string; webUrl?: string }
) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.WISHLIST.UPDATE_BID_REQUEST_STATUS,
    data
  );
  return response as unknown as IApiResponse;
};

export const getProposalDetails = async (data: any) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.WISHLIST.GET_PROPOSAL_DETAILS,
    data
  );
  return response as unknown as IApiResponse;
};

export const createWishFlight = async (data: any) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.WISHLIST.CREATE_WISHLIGHT,
    toFormData(data)
  );
  return response as unknown as IApiResponse;
};
