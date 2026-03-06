"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CLOSE_ICON } from "@/lib/images";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import ImageCustom from "@/components/common/Image";
import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";
import { flightCancelReasons } from "@/lib/constants";
import Link from "next/link";
import TextInput from "@/form/TextInput";
import FormProvider from "@/form/FormProvider";
import { CancelFlightReasonSchema } from "@/lib/schema";

interface CancelFlightReasonFormValues {
  reason: string;
  otherReason: string;
}

const CancelFlightReasonModal = ({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reasonPayload: string) => void;
}) => {
  const { t } = useTranslation("home");
  const methods = useForm<CancelFlightReasonFormValues>({
    defaultValues: { reason: "personalEmergency", otherReason: "" },
    resolver: yupResolver(
      CancelFlightReasonSchema
    ) as unknown as Resolver<CancelFlightReasonFormValues>,
  });

  const selectedReason = methods.watch("reason");
  const { reset } = methods;

  const handleReasonSelect = (reason: string) => {
    methods.setValue("reason", reason);
    if (reason !== "other") {
      methods.setValue("otherReason", "");
    }
  };

  const onSubmit = () => {
    const reason = methods.getValues("reason");
    const otherReason = methods.getValues("otherReason");
    const reasonPayload = reason === "other" ? otherReason.trim() : t(reason);
    onConfirm(reasonPayload);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[500px] w-[95%] gap-5 max-h-[90vh] p-6 rounded-[32px] overflow-hidden flex flex-col bg-[#F9F9FB]"
      >
        <div className="text-center border-b border-[#ECECED] pb-6 relative shrink-0">
          <h3 className="text-3xl font-semibold text-black">
            {t("cancelFlight")}
          </h3>
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="absolute right-0 top-0 flex items-center justify-center size-10"
          >
            <ImageCustom src={CLOSE_ICON} alt="Close" className="size-10" />
          </button>
        </div>

        <FormProvider
          methods={methods}
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex-1 min-h-0 flex flex-col overflow-hidden"
        >
          <ScrollArea className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="ticky bottom-0 z-10 bg-[#F9F9FB]">
              <div className="flex flex-col gap-[18px]">
                {flightCancelReasons.map((reason) => (
                  <div
                    key={reason}
                    className={cn(
                      "bg-white shadow-[0px_5px_13.2px_0px_#7854B814] rounded-[18px] border py-5 text-center text-xl font-normal cursor-pointer",
                      selectedReason === reason
                        ? "border-primary"
                        : "border-transparent"
                    )}
                    onClick={() => handleReasonSelect(reason)}
                  >
                    {t(reason)}
                  </div>
                ))}
              </div>
              {selectedReason === "other" && (
                <div className="mt-4 px-1">
                  <TextInput
                    textarea
                    name="otherReason"
                    placeholder={t("writeReason")}
                    className="bg-white! border-none resize-none max-h-[188px]"
                  />
                </div>
              )}
              <div className="flex items-center mt-[30px] gap-5 flex-col sticky bottom-0 z-10 bg-[#F9F9FB]">
                <Link
                  target="_blank"
                  href="https://www.aviatefinder.com/cancel-regulation"
                  className="text-primary text-lg font-normal underline bg-[#F9F9FB]"
                >
                  {t("cancelRegulations")}
                </Link>
                <Button type="submit">{t("cancel")}</Button>
              </div>
            </div>
          </ScrollArea>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CancelFlightReasonModal;
