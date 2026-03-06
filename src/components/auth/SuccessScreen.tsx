"use client";

import { useRouter } from "next/navigation";
import Button from "../common/Button";
import { SuccessScreenProps } from "@/types/auth";

const SuccessScreen = ({
  icon,
  title,
  description,
  buttonText,
  redirectTo,
}: SuccessScreenProps) => {
  const router = useRouter();

  return (
    <div className="flex-1 px-5 sm:px-5 md:px-8 lg:px-10 py-14 flex flex-col justify-center relative">
      <div className="max-w-[513px] space-y-[30px] w-full mx-auto flex flex-col">
        <div className="flex items-center justify-center">
          <img
            src={icon}
            alt="success_icon"
            className="sm:size-[140px] size-[144px]"
          />
        </div>

        <div className="flex flex-col items-center justify-center w-full">
          <div className="text-center">
            <p className="text-black text-2xl md:text-3xl leading-[45px] font-semibold">
              {title}
            </p>
            <p className="text-secondary text-base md:text-lg font-normal">
              {description}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => router.push(redirectTo)}
          className="w-full bg-primary text-white sm:text-lg text-base font-medium rounded-[14px] mt-2.5"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default SuccessScreen;
