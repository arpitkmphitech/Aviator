export type BookingTab = "upcoming" | "past";

export interface MyBookingCraftDetails {
  _id: string;
  craftModel: string;
  seatingCapacity: number;
  safetyImage: string;
}

export interface MyBookingRoutePoint {
  mainLocation: string;
  location: string;
  lat: number;
  long: number;
  _id: string;
}

export interface MyBookingItem {
  availabilityId: string;
  totalPassengers: number;
  tourType: string;
  isFlightCompleted: boolean | null;
  craftDetails: MyBookingCraftDetails;
  pendingSeatCount: number;
  bookingId: string;
  departureStartTime: string;
  departureEndTime: string;
  route: MyBookingRoutePoint[];
  invoiceUrl?: string;
  bookingType: string;
}

export interface FlightBooking {
  id: string;
  aircraftImage: string;
  aircraftModel: string;
  passengers: number;
  city: string;
  country: string;
  time: string;
  date: string;
  duration: string;
  activityType: string;
  /** Used to filter upcoming vs past */
  isUpcoming: boolean;
  isFlightCompleted?: boolean | null;
  departureEndTime?: string;
  pricePerPerson?: number;
  bookingType: string;
}

/** Passenger selection option (e.g. 1 passenger €485 per person) */
export interface PassengerOption {
  value: string;
  label: string;
  pricePerPerson: string;
}

/** Luggage weight option */
export interface LuggageOption {
  value: string;
  label: string;
}

/** Refund range option per passenger count */
export interface RefundRangeOption {
  value: string;
  label: string;
}

/** Pilot info for booking details */
export interface PilotInfo {
  pilotId: string;
  name: string;
  avgRating: number;
  profileImage: string;
  address?: string;
  description?: string;
  hoursOfFlight?: number;
  flyingExperienceYears?: number;
  pilotLicense?: string;
  ratingsEndorsements?: string;
}

/** Single passenger form data (name, gender, age, weight, profileImage) */
export interface PassengerDetailsForm {
  name: string;
  gender: string;
  age: string;
  weight: string;
  profileImage?: File | string | null;
}

/** Single lat/lng point (from API) */
export interface LatLng {
  lat: number;
  lng: number;
}

export interface RoutePoint extends LatLng {
  mainLocation?: string;
  location?: string;
  _id?: string;
  long?: number;
}

/** Full booking details page data */
export interface BookingDetailsData {
  id: string;
  galleryImages: string[];
  aircraftImage: string;
  aircraftModel: string;
  city: string;
  country: string;
  time: string;
  date: string;
  duration: string;
  activityType: string;
  pilot: PilotInfo;
  description: string;
  features: string[];
  passengersWeightKg: string;
  totalPassengers: string;
  aircraftType: string;
  arrival?: string;
  routeCoordinates?: (LatLng | RoutePoint)[];
  pricePerPerson?: number;
  luggageCapacity?: string;
  passengers?: PassengerDetailsForm[];
}

export interface Review {
  id: string;
  image: string;
  name: string;
  date: string;
  rating: number;
  text: string;
}

/** Route point for wishlist (string or object with display/mainLocation/location). */
export type WishlistRoutePoint =
  | string
  | { display?: string; mainLocation?: string; location?: string };

export interface WishlistItem {
  _id: string;
  code: string;
  from: string;
  to: string;
  /** Route array: first = from, last = to. */
  route?: WishlistRoutePoint[];
  dateTime: string;
  totalPassengers: string;
  flightType: string;
  duration: string;
  luggage: string;
  requestStatus: string;
  proposalCount?: number;
  luggageType: string;
  tourType: string;
  flightDuration: number; // in minutes,
  departureStartTime: string;
}

export interface WishlistProposal {
  _id: string;
  profile: string;
  wishlistId: string;
  pilotName: string;
  age: number;
  weight: number;
  perPersonAmount: number;
  aircraftImage: string;
  aircraftName: string;
  pricePerPerson: number;
  departureFrom: string;
  destinationTo: string;
  dateTime: string;
  passengers: string;
  flightType: string;
  duration: string;
  luggage: string;
  bidStatus: string;
  flightDetails: {
    route: WishlistRoutePoint[];
    from: string;
    to: string;
    departureStartTime: string;
    totalPassengers: string;
    tourType: string;
    flightDuration: number;
    luggageType: string;
  };
  pilotDetails: {
    name: string;
    profile: string;
  };
}

export interface RatePilotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pilotName: string;
  pilotProfileImage: string;
  onSubmit?: (rating: number, feedback: string) => void;
}

export interface RateFlightModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (rating: number, feedback: string) => void;
  isPending: boolean;
}
