export interface ILogin {
  email: string;
  password: string;
  userType?: string;
  lang?: string;
}

export interface IForgotPassword {
  email: string;
  userType: string;
}

export interface IVerifyForgotPasswordOTP {
  email: string;
  otp: string;
}

export interface IResetPassword {
  newPassword: string;
  confirmPassword?: string;
  email: string;
}

export interface IRegister {
  countryFlag: string;
  countryCode: string;
  phoneNumber: string;
  email?: string | null;
  agreeToTerms?: boolean;
}

export interface IRegisterSignUp {
  name?: string;
  email: string;
  phone: string;
  cCode: string;
  flag: string;
  phno?: string;
  address?: string;
  country: string;
  state: string;
  city: string;
  weight?: string;
  zipcode?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms: boolean;
  profileImage?: File | null;
  lang?: string;
}

export interface IEditProfile {
  lang?: string;
  name: string;
  email?: string;
  phone: string;
  cCode: string;
  flag: string;
  address: string;
  country: string;
  state: string;
  city: string;
  weight: string;
  postCode: string;
  profile?: File | null;
}

export interface SuccessScreenProps {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  redirectTo: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface IContactUs {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ISendOtp {
  email: string;
  name: string;
}

export interface IVerifyOtp {
  email: string;
  otp: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
  userType: string;
  lang: string;
}

export interface IUser {
  name: string;
  email: string;
  phone: string;
  cCode: string;
  flag?: string;
  profile: string;
  weight: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postCode: string;
  lang: string;
  userType: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isGuest: boolean;
  flag: string;
  profile: string | File | null;
}
