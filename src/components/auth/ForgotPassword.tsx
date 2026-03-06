import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SMS_ICON, BACK_ARROW, FORGOT_PASSWORD_ICON } from "@/lib/images";
import { ForgotPasswordSchema } from "@/lib/schema";
import FormProvider from "@/form/FormProvider";
import TextInput from "@/form/TextInput";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import useForgetPassword from "../../hooks/auth/useForgetPassword";

const ForgotPassword = () => {
  const router = useRouter();

  const { forgetPassword, isPending } = useForgetPassword();

  const methods = useForm({
    defaultValues: { email: "" },
    resolver: yupResolver(ForgotPasswordSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = (values: { email: string }) => {
    forgetPassword(
      { email: values?.email ?? "", userType: "traveller" },
      {
        onSuccess: () => {
          sessionStorage.setItem("email", values?.email);
          router.push("/verify-otp");
        },
      }
    );
  };

  return (
    <div className="flex-1 px-5 sm:px-5 md:px-8 lg:px-10 py-14 flex flex-col justify-center relative">
      <div className="max-w-[513px] space-y-[30px] w-full mx-auto flex flex-col">
        <div className="flex items-center justify-center">
          <img
            src={FORGOT_PASSWORD_ICON}
            alt="FORGOT_PASSWORD_ICON"
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
                Forgot Password?
              </p>
              <p className="text-secondary text-base md:text-lg sm:text-lg font-normal">
                No worries, we'll help you reset your password
              </p>
            </div>
          </div>
          <div className="space-y-4 mt-[30px]">
            <TextInput
              name="email"
              placeholder="Enter email"
              prefix={<img src={SMS_ICON} alt="SMS_ICON" />}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-white sm:text-lg text-base font-medium rounded-[14px] mt-10"
            loader={isPending}
            disabled={isPending}
          >
            Send
          </Button>
        </FormProvider>
      </div>
      <div className="absolute top-10 left-10">
        <div
          onClick={() => router.push("/login")}
          className="w-[40px] h-[40px] bg-fill border border-border rounded-[10px] flex justify-center items-center cursor-pointer"
        >
          <img src={BACK_ARROW} alt="BACK_ARROW" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
