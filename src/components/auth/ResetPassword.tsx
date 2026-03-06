import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LOCK_ICON, BACK_ARROW, RESET_PASSWORD_ICON } from "@/lib/images";
import { ResetPasswordSchema } from "@/lib/schema";
import type { IResetPassword } from "@/types/auth";
import FormProvider from "@/form/FormProvider";
import { useRouter } from "next/navigation";
import PasswordField from "@/form/PasswordField";
import Button from "../common/Button";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import md5 from "md5";

const ResetPassword = () => {
  const router = useRouter();

  const { resetPassword, isPending } = useResetPassword();
  const email = sessionStorage.getItem("email");

  const methods = useForm({
    defaultValues: { newPassword: "", confirmPassword: "" },
    resolver: yupResolver(ResetPasswordSchema),
  });

  const { handleSubmit } = methods;

  const onSubmit = (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    resetPassword(
      { newPassword: md5(values?.newPassword), email: email || "" },
      {
        onSuccess: () => {
          router.push("reset-success");
        },
      }
    );
  };

  return (
    <div className="flex-1 px-5 sm:px-5 md:px-8 lg:px-10 py-14 flex flex-col justify-center relative">
      <div className="max-w-[513px] space-y-[30px] w-full mx-auto flex flex-col">
        <div className="flex items-center justify-center">
          <img
            src={RESET_PASSWORD_ICON}
            alt="RESET_LOGO"
            className="sm:size-[140px] size-[144px]"
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
                Reset Password
              </p>
              <p className="text-secondary text-base md:text-lg sm:text-lg font-normal">
                Create a new password for your account. Make sure it’s strong
                and easy to remember
              </p>
            </div>
          </div>
          <div className="space-y-4 mt-[30px]">
            <PasswordField
              name="newPassword"
              placeholder="Enter new password"
              prefix={<img src={LOCK_ICON} alt="LOCK_ICON" />}
            />
            <PasswordField
              name="confirmPassword"
              placeholder="Confirm new password"
              prefix={<img src={LOCK_ICON} alt="LOCK_ICON" />}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-white sm:text-lg text-base font-medium rounded-[14px] mt-10"
            loader={isPending}
            disabled={isPending}
          >
            Reset Password
          </Button>
        </FormProvider>
      </div>
      <div className="absolute top-10 left-10">
        <div
          onClick={() => router.back()}
          className="w-[40px] h-[40px] bg-fill border border-border rounded-[10px] flex justify-center items-center cursor-pointer"
        >
          <img src={BACK_ARROW} alt="BACK_ARROW" />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
