export type TourType = "sightseeing" | "excursion" | "oneWay";

export type LocationInput = string[] | { lat: number; lng: number }[];

export interface ISearchAvailableFlights {
  tourType: TourType;
  from?: LocationInput;
  to?: LocationInput;
  departureDate?: string;
  craftType?: string;
  flightDuration?: string;
  passengers?: number;
  priceMin?: number;
  priceMax?: number;
  skip: number;
  limit: number;
}

export interface ISearchRoutePoint {
  mainLocation: string;
  location: string;
  lat: number;
  long: number;
  _id: string;
}

export interface ISearchAirCraftData {
  craftType: string;
  craftModel: string;
  seatingCapacity: number;
  safetyImage: string;
}

export interface IFlightAvailabilityItem {
  pilotId: string;
  craftId: string;
  flightDuration: number; // minutes
  price: number;
  departureStartTime: string;
  departureEndTime: string;
  tourType: string[];
  route: ISearchRoutePoint[];
  airCraftData: ISearchAirCraftData;
  perPersonAmount: number;
  pendingSeatCount: number;
  availabilityId: string;
}

export interface ISearchAvailableFlightsResponse {
  totalRecords: number;
  data: IFlightAvailabilityItem[];
}

export interface IAvailabilityDetails {
  _id: string;
  pilotId: string;
  flightDuration: number;
  price: number;
  departureStartTime: string;
  departureEndTime: string;
  tourType: string[];
  route: IRoute[];
  description: string;
  availabilityId: string;
  airCraftData: IAirCraftData;
  pilotData: IPilotData;
  seatDtl: ISeatDetails;
  passengerSeatWithPrice: IPassengerSeatWithPrice[];
  servicePercentage: number;
}

export interface IRoute {
  _id: string;
  mainLocation: string;
  location: string;
  lat: number;
  long: number;
}

export interface IAirCraftData {
  craftType: string;
  craftModel: string;
  seatingCapacity: number;
  weightCapacity: number;
  luggageCapacity: string[];
  specialFeature: string[];
  safetyFeature: string;
  airCraftImages: IAirCraftImage[];
  craftId: string;
  safetyImage: string;
}

export interface IAirCraftImage {
  imageId: string;
  image: string;
}

export interface IPilotData {
  pilotId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postCode: string;
  country: string;
  description: string;
  weight: string;
  qualification: string;
  experience: string;
  flightHours: number;
  totalFlightHours: number;
  avgRating: number;
  createdAt: string;
  profileImage: string;
}

export interface ISeatDetails {
  seatCapacity: number;
  bookedSeats: number;
  remainingSeats: number;
  price: number;
}

export interface IPassengerSeatWithPrice {
  seat: number;
  refundAmount: number;
  price: number;
}

export interface IPilotRatingTravellerData {
  name: string;
  travellerId: string;
  profile: string;
}

export interface IPilotRatingItem {
  _id: string;
  rate: number;
  feedback: string;
  createdAt: string;
  travellerData: IPilotRatingTravellerData;
}

export interface IPilotRatings {
  pilotId: string;
  skip: number;
  limit: number;
}

export interface IMyBookings {
  type: "upcoming" | "past";
  skip: number;
  limit: number;
}

/** Passenger from getMyBookingDetails API */
export interface IBookingDetailsPassenger {
  name?: string;
  age?: string;
  gender?: string;
  passengersWeight?: number;
  profile?: string;
}

export interface IBookingDetailsCraftImage {
  craftImageId: string;
  craftImages: string;
}

export interface IBookingDetailsPilot {
  name: string;
  address?: string;
  flightHours?: number;
  avgRating: number;
  totalFlightHours?: number;
  pilotId: string;
  profile: string;
}

export interface IBookingDetailsCraft {
  craftType: string;
  craftModel: string;
  seatingCapacity: number;
  weightCapacity?: number;
  luggageCapacity: string[];
  specialFeature: string[];
  safetyFeature?: string;
  craftId: string;
  safetyImage: string;
}

export interface IBookingDetailsAvailability {
  flightDuration: number;
  price: number;
  departureStartTime: string;
  departureEndTime: string;
  tourType: string[];
  route: IRoute[];
  description?: string | null;
  availabilityId: string;
}

/** getMyBookingDetails API response (data object) */
export interface IBookingDetailsResponse {
  _id: string;
  userId?: string;
  totalPassengers: number;
  passengersWeight?: number;
  luggageWeight?: number;
  tourType: string;
  luggageType?: string;
  perPersonAmount?: number;
  totalAmount?: number;
  status?: string;
  isFlightCompleted?: boolean | null;
  isPay?: boolean;
  craftImage?: IBookingDetailsCraftImage[];
  isRating?: boolean;
  bookingId: string;
  pilotDetails: IBookingDetailsPilot;
  craftDetails: IBookingDetailsCraft;
  availabilityDetails: IBookingDetailsAvailability;
  passengerInfo: IBookingDetailsPassenger[];
  invoiceUrl?: string;
}
