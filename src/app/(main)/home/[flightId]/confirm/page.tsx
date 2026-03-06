"use client";

import { useRouter } from "next/navigation";
import ImageCustom from "@/components/common/Image";
import Button from "@/components/common/Button";
import { ArrowLeft } from "lucide-react";
import { AIRCRAFT_ICON, AIRPLANE_ICON, PLANE1 } from "@/lib/images";
import type { BookingDetailsData } from "@/types/booking";
import { useState } from "react";
import CongratulationsModal from "@/modal/CongratulationsModal";
import { useTranslation } from "react-i18next";

const MOCK_CONFIRM_DATA = {
  booking: {
    id: "1",
    aircraftImage: PLANE1,
    aircraftModel: "Cessna 172 N",
    city: "Alkersleben",
    country: "Germany",
    time: "01:18",
    date: "Dec 12, 2025",
    duration: "2h 0m",
    activityType: "Sightseeing",
    pilot: {
      id: "p1",
      name: "Stefan Wagner",
      profileImage: PLANE1,
      seatCapacity: 2,
    },
    price: 142,
  } as BookingDetailsData & { pilot: { seatCapacity: number }; price: number },
  bookingDate: "Dec 30, 2024",
  passengerCount: 2,
  passengers: [
    { name: "Thomas Weber", image: PLANE1 },
    { name: "Maria Hoffmann", image: PLANE1, age: 22, gender: "Female" },
  ],
};

export default function BookingConfirmPage() {
  const router = useRouter();
  const { t } = useTranslation("home");
  const [openCongratulationsModal, setOpenCongratulationsModal] =
    useState(false);
  const { booking, bookingDate, passengerCount, passengers } =
    MOCK_CONFIRM_DATA;

  const handleConfirm = () => {
    setOpenCongratulationsModal(true);
  };

  return (
    <div className="min-h-full bg-[#F8F8FA] pb-[60px]">
      <div className="2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5 pt-6">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer flex items-center gap-2 text-[#1F1F1F]"
          >
            <ArrowLeft className="size-6" />
          </button>
          <Button className="w-[222px]" onClick={handleConfirm}>
            {t("confirm")}
          </Button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="bg-white rounded-[24px] flex justify-between gap-4 flex-1 shadow-[0px_7px_4.6px_0px_#7854B814] p-6">
            <div className="flex items-center gap-5">
              <ImageCustom
                src={booking.pilot?.profileImage ?? PLANE1}
                alt={booking.pilot?.name ?? ""}
                className="md:size-[80px] size-16 rounded-full object-cover shrink-0"
              />
              <div>
                <p className="font-medium text-black text-lg md:text-[22px]">
                  {booking.pilot?.name}
                </p>
              </div>
            </div>
            {/* <div className="flex items-center gap-1 text-[#98A1AB] font-medium text-sm">
              <ImageCustom src={LAMP_ICON} alt="lamp" />
              {passengerCount}
            </div> */}
          </div>
          <div className="bg-white rounded-[24px] flex justify-between items-center gap-4 flex-1 shadow-[0px_7px_4.6px_0px_#7854B814] p-6">
            <div className="flex items-center gap-5">
              <ImageCustom
                src={booking.aircraftImage}
                alt={booking.aircraftModel}
                className="md:size-[80px] size-16 rounded-full object-cover shrink-0"
              />
              <div>
                <p className="font-medium text-black text-lg md:text-[22px]">
                  {booking.aircraftModel}
                </p>
                <p className="text-base md:text-lg text-[#5C6268] font-light">
                  {t("seatCapacity")}:{" "}
                  {(booking.pilot as { seatCapacity?: number })?.seatCapacity ??
                    2}
                </p>
              </div>
            </div>
            <div className="text-primary font-semibold text-lg md:text-[22px]">
              €{(booking as { price?: number })?.price ?? 142}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-[0px_7px_4.6px_0px_#7854B814] mb-6">
          <div className="flex items-center justify-center gap-3 py-9 border-b border-[#7854B814]">
            <ImageCustom
              src={AIRCRAFT_ICON}
              alt="AIRCRAFT_ICON"
              className="size-[33px]"
            />
            <span className="font-normal text-base sm:text-[22px] text-[#7F8892]">
              {booking.activityType}
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-0 p-4 lg:p-[30px]">
            <div className="flex flex-col gap-1.5">
              <p className="font-semibold text-black text-xl lg:text-[22px]">
                {booking.city}
              </p>
              <p className="text-[#98A1AB] text-base lg:text-[20px] font-normal mt-1">
                {booking.country}
              </p>
              <p className="text-lg font-medium text-black">
                {booking.time} | {booking.date}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 min-w-0 lg:min-w-[445px] shrink-0">
              <p className="text-base font-normal text-[#2C2C2C]">
                {booking.duration}
              </p>
              <div className="flex items-center w-full lg:w-auto">
                <ImageCustom
                  src={AIRPLANE_ICON}
                  alt="AIRPLANE_ICON"
                  className="size-5 shrink-0"
                />
                <div className="border-t border-dashed border-[#DBE3EB] flex-1 lg:flex-none lg:w-[430px]" />
                <div className="size-[5px] rounded-full bg-[#DBE3EB] shrink-0" />
              </div>
              <p className="text-base font-normal text-[#7F8892]">
                {booking.activityType}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] shadow-[0px_7px_4.6px_0px_#7854B814] mb-6">
          <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3 py-[21px] px-5 sm:px-[30px] border-b border-[#7854B814]">
            <div>
              <p className="text-base sm:text-[20px] font-normal text-[#98A1AB]">
                {t("passenger")}
              </p>
              <p className="font-medium text-base sm:text-[22px] text-black">
                {passengerCount}
              </p>
            </div>
            <div>
              <p className="text-base sm:text-[20px] font-normal text-[#98A1AB]">
                {t("date")}
              </p>
              <p className="font-medium text-base sm:text-[20px] text-black">
                {bookingDate}
              </p>
            </div>
          </div>
          <div className="flex flex-col p-5 sm:p-[30px]">
            <p className="font-normal text-base sm:text-[22px] text-[#5C6268] mb-5 sm:mb-[26px]">
              {t("passengers")}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <ImageCustom
                  src={passengers[0].image}
                  alt={passengers[0].name}
                  className="md:size-[90px] size-16 rounded-full object-cover shrink-0"
                />
                <div>
                  <p className="font-semibold text-[#2C2C2C] text-lg md:text-[22px]">
                    {passengers[0].name}
                  </p>
                </div>
              </div>
            </div>
            <div className="pl-14 md:pl-20 lg:pl-[106px]">
              <div className="flex flex-col gap-4">
                {passengers.slice(1).map((p, i) => (
                  <div key={i} className="flex flex-col items-start gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <ImageCustom
                        alt={p.name}
                        src={p.image}
                        className="rounded-full object-cover size-10 sm:size-[60px]"
                      />
                      <p className="font-normal text-base sm:text-lg text-[#7F8892]">
                        {p.name}
                      </p>
                    </div>
                    <span className="flex gap-1 font-normal text-base sm:text-[20px]">
                      {t("age")}:{" "}
                      <p className="text-[#7F8892] text-base sm:text-[22px]">
                        {p.age}
                      </p>
                    </span>
                    <span className="flex gap-1 font-normal text-base sm:text-[20px]">
                      {t("gender")}:{" "}
                      <p className="text-[#7F8892] text-base sm:text-[22px]">
                        {p.gender}
                      </p>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {openCongratulationsModal && (
        <CongratulationsModal
          open={openCongratulationsModal}
          setOpen={setOpenCongratulationsModal}
        />
      )}
    </div>
  );
}
