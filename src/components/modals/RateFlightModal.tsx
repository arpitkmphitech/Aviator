"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RATING_ICON } from "@/lib/images";
import ImageCustom from "@/components/common/Image";
import TextInput from "@/form/TextInput";
import FormProvider from "@/form/FormProvider";
import Button from "@/components/common/Button";
import { RatePilotSchema } from "@/lib/schema";
import { RateFlightModalProps } from "@/types/booking";
import { useTranslation } from "react-i18next";

interface RatePilotFormValues {
  feedback: string;
}

const RateFlightModal = ({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: RateFlightModalProps) => {
  const { t } = useTranslation("wishlist");
  const { t: st } = useTranslation("home");
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

  const handleSubmitForm = async (values: RatePilotFormValues) => {
    setRatingError(null);
    if (rating === 0) {
      setRatingError("Please select a star rating.");
      return;
    }
    await onSubmit?.(rating, values.feedback);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[500px] w-[95%] gap-0 max-h-[90vh] p-5 rounded-[28px] overflow-hidden flex flex-col bg-[#F9F9FB]"
      >
        <div className="text-center border-b border-[#ECECED] pb-6 mb-5 relative shrink-0">
          <h3 className="text-2xl font-semibold text-black">
            {st("addReview")}
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center gap-8 mb-3 relative shrink-0">
          <span className="text-primary font-medium text-lg">
            {t("enjoyedTheTripLeaveAReviewForTheFlight")}
          </span>
          <span className="text-[#6F6F6F] font-normal text-lg">
            {t("rateYourExperience")}
          </span>
        </div>

        <FormProvider
          methods={methods}
          onSubmit={methods.handleSubmit(handleSubmitForm)}
          className="flex-1 min-h-0 flex flex-col overflow-hidden"
        >
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="mb-7">
              <div className="flex gap-2.5 justify-center items-center">
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
                      className="size-8 transition-colors bborde"
                      fill={star <= rating ? "#7854B8" : "#98A1AB"}
                      stroke="transparent"
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
              {ratingError && (
                <p className="mt-1.5 text-sm text-center text-red-500">
                  {ratingError}
                </p>
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

            <Button type="submit" loader={isPending} disabled={isPending}>
              {t("submit")}
            </Button>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default RateFlightModal;
