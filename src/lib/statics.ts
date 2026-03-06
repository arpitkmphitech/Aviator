export const HEADER_LINKS = [
  {
    label: "home",
    href: "/home",
    disabled: false,
  },
  {
    label: "myBookings",
    href: "/my-bookings",
    disabled: false,
  },
  {
    label: "Chat",
    href: "/chat",
    disabled: false,
  },
];

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "de", label: "German" },
] as const;

export const BOOKING_TABS = [
  { value: "upcoming", label: "upcoming" },
  { value: "past", label: "past" },
] as const;

export const PASSENGER_SELECT_OPTIONS = [
  { value: "1", label: "1 passenger", pricePerPerson: "€485 Per Person" },
  { value: "2", label: "2 passengers", pricePerPerson: "€318 Per Person" },
  { value: "3", label: "3 passengers", pricePerPerson: "€243 Per Person" },
] as const;

export const LUGGAGE_OPTIONS = [
  { value: "none", label: "No luggage" },
  { value: "medium", label: "Medium (bag - 10 kg)" },
  { value: "large", label: "Large (bag - 20 kg)" },
] as const;

export const REFUND_RANGE_OPTIONS = [
  {
    value: "1",
    label: "1 Passenger: (€3222.30 - €161616.5 Max. Refund)",
  },
  {
    value: "2",
    label: "2 Passenger: (€43097.33 - €161616.5 Max. Refund)",
  },
  {
    value: "3",
    label: "3 Passenger: (€43097.33 - €161616.5 Max. Refund)",
  },
] as const;

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;
