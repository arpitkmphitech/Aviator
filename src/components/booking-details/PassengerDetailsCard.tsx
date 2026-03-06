"use client";

import ImageCustom from "@/components/common/Image";
import type { PassengerDetailsForm } from "@/types/booking";
import {
  GENDER_ICON,
  LIST_ICON,
  USER_PROFILE_ICON,
  WEIGHT_PURPLE_ICON,
} from "@/lib/images";

type PassengerDetailsCardProps = {
  index: number;
  form: PassengerDetailsForm;
};

export function PassengerDetailsCard({
  index,
  form,
}: PassengerDetailsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-7xl p-4">
      <div className="flex items-center gap-2 mb-4 border-b border-[#ECECED] pb-3.5">
        <ImageCustom
          alt={form.name}
          src={form.profileImage as string}
          className="w-[34px] h-[34px] rounded-full"
        />
        <h2 className="text-[#1F1F1F] sm:text-lg text-base font-normal">
          Passenger: {index + 1}
        </h2>
      </div>
      <div className=" grid grid-cols-2 gap-4">
        <div className="flex items-center  bg-[#F5F5F5] py-[13px] rounded-[12px] px-4 gap-2.5">
          <ImageCustom
            src={USER_PROFILE_ICON}
            alt="USER_PROFILE_ICON"
            className="w-[24px] h-[24px]"
          />
          <p className="text-sm text-[#2C2C2C] font-normal">{form.name}</p>
        </div>
        <div className="flex items-center capitalize bg-[#F5F5F5] py-[13px] rounded-[12px] px-4 gap-2.5">
          <ImageCustom
            src={GENDER_ICON}
            alt="USER_PROFILE_ICON"
            className="w-[24px] h-[24px]"
          />
          <p className="text-sm text-[#2C2C2C] font-normal">{form.gender}</p>
        </div>
        <div className="flex items-center bg-[#F5F5F5] py-[13px] rounded-[12px] px-4 gap-2.5">
          <ImageCustom
            src={LIST_ICON}
            alt="USER_PROFILE_ICON"
            className="w-[24px] h-[24px]"
          />
          <p className="text-sm text-[#2C2C2C] font-normal">{form.age}</p>
        </div>
        <div className="flex items-center  bg-[#F5F5F5] py-[13px] rounded-[12px] px-4 gap-2.5">
          <ImageCustom
            src={WEIGHT_PURPLE_ICON}
            alt="USER_PROFILE_ICON"
            className="w-[24px] h-[24px]"
          />
          <p className="text-sm text-[#2C2C2C] font-normal">{form.weight}</p>
        </div>
      </div>
    </div>
  );
}
