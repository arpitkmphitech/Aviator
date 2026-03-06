"use client";

import { useState } from "react";
import ImageCustom from "@/components/common/Image";
import PhotosModal from "@/modal/PhotosModal";
import type { IAvailabilityDetails } from "@/types/home";
import type { BookingDetailsData } from "@/types/booking";
import { useTranslation } from "react-i18next";

type BookingGalleryProps = {
  booking: IAvailabilityDetails | BookingDetailsData;
  photosIconSrc: string;
};

function isAvailabilityDetails(
  booking: IAvailabilityDetails | BookingDetailsData
): booking is IAvailabilityDetails {
  return "airCraftData" in booking;
}

export function BookingGallery({
  booking,
  photosIconSrc,
}: BookingGalleryProps) {
  const [photosModalOpen, setPhotosModalOpen] = useState(false);
  const isAvailability = isAvailabilityDetails(booking);

  const mainImage = isAvailability
    ? booking?.airCraftData?.airCraftImages?.[0]?.image
    : (booking as BookingDetailsData).aircraftImage;
  const gridImages = isAvailability
    ? booking?.airCraftData?.airCraftImages?.slice(1, 5)
    : ((booking as BookingDetailsData).galleryImages?.slice(1, 5) ?? []);
  const allImages = isAvailability
    ? booking?.airCraftData?.airCraftImages?.length
      ? booking.airCraftData.airCraftImages.map((img) => img.image)
      : [booking?.airCraftData?.airCraftImages?.[0]?.image].filter(Boolean)
    : ((booking as BookingDetailsData).galleryImages ?? []).length
      ? (booking as BookingDetailsData).galleryImages
      : [(booking as BookingDetailsData).aircraftImage];
  const imagesForModal = allImages?.map((url) => ({ imgUrl: url }));
  const altText = isAvailability
    ? booking?.airCraftData?.craftModel
    : (booking as BookingDetailsData).aircraftModel;
  const { t } = useTranslation("home");

  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 rounded-xl overflow-hidden mb-6">
      <div className="relative h-[600px] bg-[#EEEEEE] rounded-l-xl overflow-hidden">
        <ImageCustom
          src={mainImage}
          alt={altText ?? ""}
          className="object-cover w-full h-full aspect-16/10"
          fill
        />
      </div>
      <div className="relative grid grid-cols-2 gap-2">
        {gridImages?.slice(0, 4).map((src, i) => (
          <div
            key={
              isAvailability ? ((src as { imageId?: string })?.imageId ?? i) : i
            }
            className="relative bg-[#EEEEEE] rounded-r-xl overflow-hidden lg:rounded-none"
          >
            <ImageCustom
              src={
                typeof src === "string"
                  ? src
                  : (src as { image: string })?.image
              }
              alt={
                typeof src === "string"
                  ? ""
                  : ((src as { image: string })?.image ?? "")
              }
              className="object-cover w-full h-full"
              fill
            />
          </div>
        ))}
        {gridImages?.length > 4 && (
          <div className="absolute bottom-4 right-2">
            <button
              type="button"
              onClick={() => setPhotosModalOpen(true)}
              className="cursor-pointer flex items-center gap-2 rounded-[10px] bg-white px-3 py-2 text-[#1F1F1F] sm:text-base text-sm font-medium"
            >
              <ImageCustom src={photosIconSrc} alt="photos" />
              {t("showAllPhotos")}
            </button>
          </div>
        )}
      </div>
      <PhotosModal
        open={photosModalOpen}
        images={imagesForModal}
        setOpen={setPhotosModalOpen}
      />
    </div>
  );
}
