import { useForm } from "react-hook-form";
import FormProvider from "@/form/FormProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema } from "@/lib/schema";
import TextInput from "@/form/TextInput";
import PasswordField from "@/form/PasswordField";
import { LOGIN_ICON, SMS_ICON, LOCK_ICON } from "@/lib/images";
import Button from "@/components/common/Button";
import type { ILogin, ILoginRequest } from "@/types/auth";
import Link from "next/link";
import ImageCustom from "../common/Image";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import useLogin from "@/hooks/auth/useLogin";
import { IApiResponse } from "@/types/types";
import md5 from "md5";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useUser } from "@/hooks/useUser";

const Login = () => {
  const router = useRouter();
  const { login, isPending } = useLogin();
  const methods = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(LoginSchema),
  });
  const { setUser } = useUser();

  useEffect(() => {
    if (router) {
      router.replace("/login");
      Cookies.remove("token");
      sessionStorage.removeItem("user_id");
      setUser(null);
    }
  }, [router]);

  const { handleSubmit } = methods;

  const onSubmit = (values: { email: string; password: string }) => {
    login(
      {
        email: values?.email,
        password: md5(values?.password),
        userType: "traveller",
        lang: "en",
      } as ILoginRequest,
      {
        onSuccess: (data: IApiResponse) => {
          router.replace("/home");
        },
      }
    );
  };

  return (
    <div className=" flex-1 px-5 sm:px-5 md:px-8 lg:px-10 py-14 flex items-center relative">
      <div className="max-w-[513px] space-y-[30px] w-full mx-auto flex flex-col">
        <div className="flex items-center justify-center">
          <ImageCustom
            src={LOGIN_ICON}
            alt="LOGIN_ICON"
            className="sm:size-[140px] size-[114px]"
          />
        </div>
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(onSubmit)}
          className="w-full"
        >
          <div className="text-center">
            <p className="text-black text-2xl md:text-3xl leading-[45px] font-semibold">
              Welcome to Aviatefinder
            </p>
            <p className="text-secondary text-base md:text-lg sm:text-lg font-normal">
              Please sign in to continue
            </p>
          </div>
          <div className="space-y-4 mt-[30px]">
            <TextInput
              name="email"
              placeholder="Enter email"
              prefix={<img src={SMS_ICON} alt="SMS_ICON" />}
            />
            <PasswordField
              name="password"
              placeholder="Enter password"
              prefix={<img src={LOCK_ICON} alt="LOCK_ICON" />}
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            {/* <label className="flex items-center space-x-2 cursor-pointer">
              <Checkbox className="cursor-pointer size-6 rounded-[8px] border-[1.5px] border-[#98A1AB]" />
              <span className="text-base font-medium text-secondary">
                Remember me
              </span>
            </label> */}
            <Link
              href="/forgot-password"
              className="text-base font-medium text-secondary"
            >
              Forgot Password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-white sm:text-lg text-base font-medium rounded-[14px] mt-10"
            disabled={isPending}
            loader={isPending}
          >
            Login
          </Button>
          <div className="text-center mt-5">
            <span className="text-lg font-normal text-secondary">
              Don’t have an account?{" "}
              <Link href="/register" className="text-primary">
                Register
              </Link>
            </span>
          </div>
        </FormProvider>
      </div>
    </div>
  );
};

export default Login;
