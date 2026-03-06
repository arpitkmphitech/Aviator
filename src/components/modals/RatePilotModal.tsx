"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CLOSE_ICON, RATING_ICON } from "@/lib/images";
import ImageCustom from "@/components/common/Image";
import TextInput from "@/form/TextInput";
import FormProvider from "@/form/FormProvider";
import Button from "@/components/common/Button";
import { RatePilotSchema } from "@/lib/schema";
import { RatePilotModalProps } from "@/types/booking";
import { useTranslation } from "react-i18next";

interface RatePilotFormValues {
  feedback: string;
}

const RatePilotModal = ({
  open,
  onOpenChange,
  pilotName,
  pilotProfileImage,
  onSubmit,
}: RatePilotModalProps) => {
  const { t } = useTranslation("wishlist");
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState<string | null>(null);

  const methods = useForm<RatePilotFormValues>({
    defaultValues: { feedback: "" },
    resolver: yupResolver(
      RatePilotSchema
    ) as unknown as Resolver<RatePilotFormValues>,
  });

  const { reset } = methods;

  const handleClose = () => {
    setRating(0);
    setRatingError(null);
    reset();
    onOpenChange(false);
  };

  const handleSubmitForm = (values: RatePilotFormValues) => {
    setRatingError(null);
    if (rating === 0) {
      setRatingError("Please select a star rating.");
      return;
    }
    onSubmit?.(rating, values.feedback);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[500px] w-[95%] gap-0 max-h-[90vh] p-5 rounded-[28px] overflow-hidden flex flex-col bg-[#F9F9FB]"
      >
        <div className="flex flex-col items-center justify-center mb-7 relative shrink-0">
          <ImageCustom
            src={RATING_ICON}
            alt="Rating"
            className="size-[92px] mb-5"
          />
          <h2 className="text-[22px] font-semibold text-black leading-[36px]">
            {t("rateYourPilot")}
          </h2>
          <p className="text-base font-normal text-[#6F6F6F] mb-1.5 max-w-[283px] text-center">
            {t("yourFeedbackHelpsMaintainHighServiceQuality")}
          </p>
        </div>

        <FormProvider
          methods={methods}
          onSubmit={methods.handleSubmit(handleSubmitForm)}
          className="flex-1 min-h-0 flex flex-col overflow-hidden"
        >
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center gap-3 mb-7">
              <ImageCustom
                src={pilotProfileImage}
                alt={pilotName}
                className="size-12 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-normal text-[#666666]">
                  {t("pilotName")}
                </p>
                <p className="text-base font-semibold text-[#333333]">
                  {pilotName}
                </p>
              </div>
            </div>

            <div className="mb-7">
              <div className="flex gap-2.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setRating(star);
                      setRatingError(null);
                    }}
                    className="p-0.5 rounded cursor-pointer"
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <Star
                      className="size-8 transition-colors"
                      fill={star <= rating ? "#FFC107" : "transparent"}
                      stroke={star <= rating ? "#FFC107" : "#7F4CDD"}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
              {ratingError && (
                <p className="mt-1.5 text-sm text-red-500">{ratingError}</p>
              )}
            </div>

            <div className="mb-6 px-1">
              <TextInput
                textarea
                name="feedback"
                placeholder={t("enterFeedback")}
                className="bg-white border border-border resize-none min-h-[132px]"
              />
            </div>

            <Button type="submit">{t("submit")}</Button>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default RatePilotModal;
