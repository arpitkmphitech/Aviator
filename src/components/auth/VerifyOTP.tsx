import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VerifyOTPSchema } from "@/lib/schema";

import { BACK_ARROW, VERIFY_OTP_ICON } from "@/lib/images";
import { IVerifyForgotPasswordOTP } from "@/types/auth";
import FormProvider from "@/form/FormProvider";
import { useRouter } from "next/navigation";
import Button from "../common/Button";
import OtpFields from "@/form/OTPFields";
import { useVerifyOTP } from "@/hooks/auth/useVerifyOTP";
import { useSendOtp } from "@/hooks/auth/useSendOtp";
import useForgetPassword from "@/hooks/auth/useForgetPassword";

const VerifyOTP = () => {
  const router = useRouter();

  const email = sessionStorage.getItem("email");
  const { verifyOTP, isPending } = useVerifyOTP();
  const { forgetPassword, isPending: isSendOtpPending } = useForgetPassword();

  const methods = useForm({
    defaultValues: { otp: "" },
    resolver: yupResolver(VerifyOTPSchema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = (values: { otp: string }) => {
    verifyOTP(
      { email: email || "", otp: values.otp },
      {
        onSuccess: () => {
          router.push("/reset-password");
        },
      }
    );
  };

  const handleResend = () => {
    forgetPassword(
      { email: email || "", userType: "traveller" },
      {
        onSuccess: () => {
          reset({ otp: "" });
        },
      }
    );
  };

  return (
    <div className="flex-1 px-5 sm:px-5 md:px-8 lg:px-10 py-14 flex flex-col justify-center relative">
      <div className="max-w-[513px] space-y-[30px] w-full mx-auto flex flex-col">
        <div className="flex items-center justify-center">
          <img
            src={VERIFY_OTP_ICON}
            alt="VERIFY_OTP_ICON"
            className="sm:size-[140px] size-[114px]"
          />
        </div>
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(onSubmit)}
          className="w-full"
        >
          <div className="flex flex-col items-center justify-center w-full">
            <div className="text-center">
              <p className="text-black text-2xl md:text-3xl leading-[45px] font-semibold">
                Authentication
              </p>
              <p className="text-secondary text-base md:text-lg sm:text-lg font-normal">
                Enter the verification code sent to your email
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-[30px] w-full">
            <OtpFields name="otp" />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-white sm:text-lg text-base font-medium rounded-[14px] mt-10"
            loader={isPending}
            disabled={isPending}
          >
            Verify
          </Button>
          <p className="text-secondary text-lg font-normal text-center mt-[20px]">
            Didn’t receive the code?{" "}
            <span
              onClick={handleResend}
              className="text-primary cursor-pointer"
            >
              Resend
            </span>
          </p>
        </FormProvider>
      </div>
      <div className="absolute top-10 left-10">
        <div
          className="w-[40px] h-[40px] bg-fill border border-border rounded-[10px] flex justify-center items-center cursor-pointer"
          onClick={() => router.back()}
        >
          <img src={BACK_ARROW} alt="BACK_ARROW" />
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
