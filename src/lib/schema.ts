import * as yup from "yup";
import i18n from "i18next";
import { countries } from "@/data/country";

const v = (key: string) => i18n.t(`profile:validation.${key}`);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneNumberSchema = yup
  .string()
  .trim()
  .required("Please enter phone number")
  .test("phone-number-valid", "Please enter a valid phone number", (value) => {
    if (!value) return false;
    const phoneWithoutCountryCode = value
      .replace(/^\+\d{1,4}/, "")
      .replace(/\s/g, "");
    return phoneWithoutCountryCode.length >= 4;
  });

const getCountryByFlag = (flag: string) =>
  countries.find((c) => c.flag === flag);

const imageSchema = yup
  .mixed()
  .required("Please select profile image")
  .test(
    "file-format",
    "Only JPG, JPEG, PNG, WEBP files are allowed",
    (value) => {
      if (!value) return false;
      const file = value as File;
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      return allowedTypes.includes(file.type);
    }
  );

// const optionalImageSchema = yup
//   .mixed()
//   .optional()
//   .nullable()
//   .test(
//     "file-format",
//     () => v("imageFormat"),
//     (value) => {
//       if (!value) return true;
//       const file = value as File;
//       const allowedTypes = [
//         "image/jpeg",
//         "image/jpg",
//         "image/png",
//         "image/webp",
//       ];
//       return allowedTypes.includes(file.type);
//     }
//   );

const optionalImageSchema = yup
  .mixed()
  .optional()
  .nullable()
  .test(
    "file-format",
    () => v("imageFormat"),
    (value) => {
      if (!value) return true;

      // 👇 If it's already a string (existing image URL), skip validation
      if (typeof value === "string") return true;

      // 👇 Validate only if it's a File
      if (value instanceof File) {
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        return allowedTypes.includes(value.type);
      }

      return false;
    }
  );

const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Please enter email")
    .matches(emailRegex, "Please enter a valid email address"),
  password: yup.string().trim().required("Please enter password"),
});

const ForgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Please enter email")
    .matches(emailRegex, "Please enter a valid email address"),
});

const VerifyOTPSchema = yup.object().shape({
  otp: yup
    .string()
    .trim()
    .required(() => "Please enter OTP")
    .length(4, () => "OTP must be 4 digits"),
});

const ResetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .trim()
    .required("Please enter new password")
    .min(
      8,
      "New password must be more than 8 characters long including lower case, upper case, number and a special character"
    )
    .matches(
      /[A-Z]/,
      "New password must be more than 8 characters long including lower case, upper case, number and a special character"
    )
    .matches(
      /[a-z]/,
      "New password must be more than 8 characters long including lower case, upper case, number and a special character"
    )
    .matches(
      /[0-9]/,
      "New password must be more than 8 characters long including lower case, upper case, number and a special character"
    )
    .matches(
      /[@$!%*?&#]/,
      "New password must be more than 8 characters long including lower case, upper case, number and a special character"
    ),
  confirmPassword: yup
    .string()
    .trim()
    .required("Please enter confirm password")
    .oneOf(
      [yup.ref("newPassword"), ""],
      " New password and confirm password does not match"
    ),
});

const RegisterSchema = yup.object().shape({
  name: yup.string().trim().required("Please enter full name"),
  email: yup
    .string()
    .trim()
    .required("Please enter email")
    .matches(emailRegex, "Please enter a valid email address"),
  phone: yup
    .string()
    .trim()
    .required("Please enter phone number")
    .test(
      "phone-length-by-country",
      "Please enter a valid phone number for the selected country",
      function (value) {
        if (!value) return false;
        const { flag } = this.parent;
        const country = flag ? getCountryByFlag(flag) : null;
        const nationalDigits = value.replace(/\D/g, "");
        if (!country) return nationalDigits.length >= 4;
        const min = country.minLength ?? 4;
        const max = country.maxLength ?? 15;
        return nationalDigits.length >= min && nationalDigits.length <= max;
      }
    ),
  cCode: yup.string().trim().required("Please select country code"),
  flag: yup.string().trim().required("Please select country"),
  address: yup
    .mixed()
    .required("Please enter address")
    .test(
      "address-valid",
      "Please select an address from the suggestions",
      (value) => {
        if (!value) return false;
        if (typeof value === "string") return value.trim().length > 0;
        return (
          typeof value === "object" &&
          value !== null &&
          typeof (value as { display?: string }).display === "string" &&
          (value as { display: string }).display.trim().length > 0
        );
      }
    ),
  weight: yup
    .string()
    .trim()
    .required("Please enter body weight")
    .test("weight-range", "Weight must be between 1 and 500 kg", (value) => {
      if (!value) return false;
      const num = Number(value);
      return !Number.isNaN(num) && num >= 1 && num <= 500;
    }),
  zipcode: yup
    .string()
    .trim()
    .required("Please enter postal code")
    .min(3, "Postal code must be at least 3 characters")
    .max(15, "Postal code must be at most 15 characters"),
  country: yup.string().trim().required("Please select country"),
  state: yup.string().trim().required("Please select state"),
  city: yup.string().trim().required("Please select city"),
  password: yup
    .string()
    .trim()
    .required("Please enter new password")
    .min(
      8,
      "Password must be more than 8 characters long including lower case, upper case, number and a special character"
    )
    .matches(
      /[A-Z]/,
      "Password must include upper case, lower case, number and a special character"
    )
    .matches(
      /[a-z]/,
      "Password must include upper case, lower case, number and a special character"
    )
    .matches(
      /[0-9]/,
      "Password must include upper case, lower case, number and a special character"
    )
    .matches(
      /[@$!%*?&#]/,
      "Password must include upper case, lower case, number and a special character"
    ),
  confirmPassword: yup
    .string()
    .trim()
    .required("Please confirm password")
    .oneOf(
      [yup.ref("password"), ""],
      "New password and confirm password do not match"
    ),
  agreeToTerms: yup
    .boolean()
    .oneOf([true], "You must agree to Privacy Policy and Terms & Conditions"),
  profileImage: yup
    .mixed()
    .required("Please select profile image")
    .test(
      "file-format",
      "Only JPG, JPEG, PNG, WEBP files are allowed",
      (value) => {
        if (!value) return false;
        const file = value as File;
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        return allowedTypes.includes(file.type);
      }
    ),
});

const newPasswordRule = yup
  .string()
  .trim()
  .required(() => v("newPasswordRequired"))
  .min(8, () => v("newPasswordRules"))
  .matches(/[A-Z]/, () => v("newPasswordRules"))
  .matches(/[a-z]/, () => v("newPasswordRules"))
  .matches(/[0-9]/, () => v("newPasswordRules"))
  .matches(/[@$!%*?&#]/, () => v("newPasswordRules"));

const ChangePasswordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .trim()
    .required(() => v("currentPasswordRequired")),
  newPassword: newPasswordRule,
  confirmPassword: yup
    .string()
    .trim()
    .required(() => v("confirmNewPasswordRequired"))
    .oneOf([yup.ref("newPassword"), ""], () => v("passwordMismatch")),
});

const EditProfileSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required(() => v("fullNameRequired")),
  email: yup
    .string()
    .trim()
    .required(() => v("emailRequired"))
    .matches(emailRegex, () => v("emailInvalid")),
  phone: yup
    .string()
    .trim()
    .required(() => v("phoneRequired"))
    .test(
      "phone-length-by-country",
      () => v("phoneInvalid"),
      function (value) {
        if (!value) return false;
        const { flag } = this.parent;
        const country = flag ? getCountryByFlag(flag) : null;
        const nationalDigits = value.replace(/\D/g, "");
        if (!country) return nationalDigits.length >= 4;
        const min = country.minLength ?? 4;
        const max = country.maxLength ?? 15;
        return nationalDigits.length >= min && nationalDigits.length <= max;
      }
    ),
  // ccode: yup
  //   .string()
  //   .trim()
  //   .required(() => v("countryCodeRequired")),
  // countryFlag: yup
  //   .string()
  //   .trim()
  //   .required(() => v("countryRequired")),
  address: yup
    .string()
    .trim()
    .required(() => v("addressRequired")),
  weight: yup
    .string()
    .trim()
    .required(() => v("weightRequired"))
    .test(
      "weight-range",
      () => v("weightRange"),
      (value) => {
        if (!value) return false;
        const num = Number(value);
        return !Number.isNaN(num) && num >= 1 && num <= 500;
      }
    ),
  postCode: yup
    .string()
    .trim()
    .required(() => v("postalCodeRequired"))
    .min(3, () => v("postalCodeMin"))
    .max(15, () => v("postalCodeMax")),
  country: yup
    .string()
    .trim()
    .required(() => v("countryRequired")),
  state: yup
    .string()
    .trim()
    .required(() => v("stateRequired")),
  city: yup
    .string()
    .trim()
    .required(() => v("cityRequired")),
  profile: optionalImageSchema,
});

const requiredProfileImageSchema = yup
  .mixed()
  .required(() => v("profileImageRequired"))
  .test(
    "file-format",
    () => v("imageFormat"),
    (value) => {
      if (!value) return false;
      if (typeof value === "string") return true;
      const file = value as File;
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      return allowedTypes.includes(file.type);
    }
  );

const PassengerDetailsSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required(() => v("nameRequired")),
  gender: yup
    .string()
    .trim()
    .required(() => v("genderRequired")),
  age: yup
    .string()
    .trim()
    .required(() => v("ageRequired")),
  weight: yup
    .string()
    .trim()
    .required(() => v("weightRequired"))
    .test(
      "weight-range",
      () => v("weightRange"),
      (value) => {
        if (!value) return false;
        const num = Number(value);
        return !Number.isNaN(num) && num >= 1 && num <= 500;
      }
    ),
  profileImage: requiredProfileImageSchema,
});

const ContactUsSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required(() => v("nameRequired")),
  email: yup
    .string()
    .trim()
    .required(() => v("emailRequired"))
    .matches(emailRegex, () => v("emailInvalid")),
  subject: yup
    .string()
    .trim()
    .required(() => v("subjectRequired")),
  message: yup
    .string()
    .trim()
    .required(() => v("messageRequired")),
});

const CancelFlightReasonSchema = yup.object().shape({
  reason: yup.string().required(() => v("pleaseSelectAReason")),
  otherReason: yup.string().when("reason", {
    is: "other",
    then: (schema) =>
      schema
        .trim()
        .required(() => v("pleaseEnterTheReasonForCancellation"))
        .min(10, () => v("reasonMustBeAtLeast10Characters")),
    otherwise: (schema) => schema.optional(),
  }),
});

const RatePilotSchema = yup.object().shape({
  feedback: yup
    .string()
    .trim()
    .required(() => v("feedbackRequired")),
});

const NewFlightRequestSchema = yup.object().shape({
  flightType: yup
    .string()
    .oneOf(["sightseeing", "excursion", "oneWay"], () => v("flightTypeInvalid"))
    .required(() => v("flightTypeRequired")),
  routes: yup
    .array()
    .of(
      yup.object().shape({
        display: yup.string().trim(),
        lat: yup.number().optional(),
        lng: yup.number().optional(),
      })
    )
    .test(
      "routes-required",
      () => v("routesRequired"),
      function (routes) {
        if (!routes || !Array.isArray(routes)) return false;
        const flightType = this.parent?.flightType;
        if (flightType === "sightseeing") {
          const allFilled = routes.every((r) => r?.display?.trim?.());
          if (!allFilled) {
            return this.createError({
              path: this.path,
              message: v("sightseeingRouteRequired"),
            });
          }
          return true;
        }
        const from = routes[0]?.display?.trim?.();
        const to = routes[1]?.display?.trim?.();
        return Boolean(from && to);
      }
    ),
  date: yup
    .string()
    .trim()
    .required(() => v("dateRequired")),
  startTime: yup
    .string()
    .trim()
    .required(() => v("startTimeRequired")),
  endTime: yup
    .string()
    .trim()
    .required(() => v("endTimeRequired"))
    .test(
      "end-after-start",
      () => v("endTimeAfterStart"),
      function (endTime) {
        const { startTime } = this.parent;
        if (!startTime || !endTime) return true;
        const [sh, sm] = startTime.split(":").map(Number);
        const [eh, em] = endTime.split(":").map(Number);
        const startMins = sh * 60 + sm;
        const endMins = eh * 60 + em;
        return endMins > startMins;
      }
    ),
  luggage: yup
    .string()
    // .oneOf(["medium", "none"], () => v("luggageInvalid"))
    .required(() => v("luggageRequired")),
  passengerCount: yup
    .number()
    .min(1, () => v("passengerCountMin"))
    .required(() => v("passengerCountRequired")),
  passengers: yup
    .array()
    .of(PassengerDetailsSchema)
    .test(
      "passengers-filled",
      () => v("passengersFilled"),
      function (passengers) {
        const count = this.parent?.passengerCount ?? 0;
        if (!passengers || count <= 0) return true;
        const toValidate = passengers.slice(0, count);
        for (let i = 0; i < toValidate.length; i++) {
          try {
            PassengerDetailsSchema.validateSync(toValidate[i]);
          } catch {
            return false;
          }
        }
        return true;
      }
    ),
  comment: yup
    .string()
    .trim()
    .required(() => v("commentRequired")),
});

export {
  LoginSchema,
  ForgotPasswordSchema,
  VerifyOTPSchema,
  ResetPasswordSchema,
  RegisterSchema,
  EditProfileSchema,
  ChangePasswordSchema,
  ContactUsSchema,
  PassengerDetailsSchema,
  CancelFlightReasonSchema,
  RatePilotSchema,
  NewFlightRequestSchema,
};
