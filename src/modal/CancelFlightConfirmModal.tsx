"use client";

import Button from "@/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import ImageCustom from "@/components/common/Image";
import { CANCEL_FLIGHT_ICON } from "@/lib/images";

const CancelFlightConfirmModal = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}) => {
  const { t } = useTranslation("home");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[90vw] max-w-[336px] sm:max-w-[450px] rounded-[28px] p-6 gap-8 bg-linear-to-b from-[#FAFAFC] from-0% to-[#F5F5F5] to-[80.54%]"
      >
        <DialogHeader className="items-center text-center">
          <ImageCustom
            src={CANCEL_FLIGHT_ICON}
            alt="CANCEL_FLIGHT_ICON"
            className="size-[120px] mb-2"
          />
          <DialogTitle className="text-[25px] font-semibold text-black">
            {t("cancelFlight")}
          </DialogTitle>
          <DialogDescription className="text-lg font-normal text-[#5C6268] max-w-[300px] text-center">
            {t("cancelFlightDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-5">
          <Button
            type="button"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            className="font-semibold bg-white text-[#98A1AB]"
          >
            {t("no")}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            loader={isLoading}
            disabled={isLoading}
          >
            {t("yes")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelFlightConfirmModal;
