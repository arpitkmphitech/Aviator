"use client";

import Button from "@/components/common/Button";
import ImageCustom from "@/components/common/Image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SUCCESS_ICON } from "@/lib/images";
import { useTranslation } from "react-i18next";

type BookingStatusConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

const BookingStatusConfirmModal = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isLoading,
}: BookingStatusConfirmModalProps) => {
  const { t } = useTranslation("home");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[90vw] max-w-[336px] sm:max-w-[450px] rounded-[28px] p-6 gap-8 bg-linear-to-b from-[#FAFAFC] from-0% to-[#F5F5F5] to-[80.54%]"
      >
        <DialogHeader className="items-center text-center">
          <ImageCustom
            src={SUCCESS_ICON}
            alt="SUCCESS_ICON"
            className="size-[120px] mb-2"
          />
          <DialogTitle className="text-[20px] sm:text-[22px] font-semibold text-black">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-base font-normal text-[#5C6268] max-w-[320px] text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-5 mt-4">
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

export default BookingStatusConfirmModal;
