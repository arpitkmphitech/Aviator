import API_ENDPOINTS from "@/lib/endpoints";
import type {
  IMyBookings,
  IPilotRatings,
  ISearchAvailableFlights,
} from "@/types/home";
import { IApiResponse } from "@/types/types";
import axiosInstance from "@/utils/axiosInstance";

export const searchAvailableFlights = async (
  data: ISearchAvailableFlights
): Promise<IApiResponse> => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.HOME.SEARCH_AVAILABLE_FLIGHTS,
    data
  );
  return response as unknown as IApiResponse;
};

export const getSortFlightList = async () => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.HOME.GET_SORT_FLIGHT_LIST
  );
  return response as unknown as IApiResponse;
};

export const getAvailabilityDetails = async (availabilityId: string) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.HOME.GET_AVAILABILITY_DETAILS,
    { availabilityId }
  );
  return response as unknown as IApiResponse;
};

export const bookFlight = async (formData: FormData) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.HOME.BOOK_FLIGHT,
    formData
  );
  return response as unknown as IApiResponse;
};

export const getPilotRatings = async (data: IPilotRatings) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.HOME.GET_PILOT_RATINGS,
    data
  );
  return response as unknown as IApiResponse;
};

export const getMyBookings = async (data: IMyBookings) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.HOME.GET_MY_BOOKINGS,
    data
  );
  return response as unknown as IApiResponse;
};

export const getBookingDetails = async (bookingId: string) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.HOME.GET_BOOKING_DETAILS,
    { bookingId }
  );
  return response as unknown as IApiResponse;
};

export const cancelBooking = async (bookingId: string, reason: string) => {
  const response = await axiosInstance.post(API_ENDPOINTS.HOME.CANCEL_BOOKING, {
    bookingId,
    cancelReason: reason,
  });
  return response as unknown as IApiResponse;
};

export const getPilotUpcomingFlights = async (data: IPilotRatings) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.HOME.GET_PILOT_UPCOMING_FLIGHTS,
    data
  );
  return response as unknown as IApiResponse;
};

export const updateBookingStatus = async (
  bookingId: string,
  consent: string
) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.HOME.UPDATE_BOOKING_STATUS,
    {
      bookingId,
      consent,
    }
  );
  return response as unknown as IApiResponse;
};

export const rateFlight = async (
  pilotId: string,
  bookingId: string,
  rating: number,
  feedback: string
) => {
  const response = await axiosInstance.post(API_ENDPOINTS.HOME.RATE_FLIGHT, {
    pilotId,
    bookingId,
    rate: String(rating),
    feedback,
  });
  return response as unknown as IApiResponse;
};
