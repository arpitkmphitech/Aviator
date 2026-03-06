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
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const CongratulationsModal = ({
  open,
  setOpen,
  onOk,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onOk?: () => void;
}) => {
  const router = useRouter();
  const { t } = useTranslation("home");
  const handleok = () => {
    setOpen(false);
    if (onOk) onOk();
    else router.push("/home");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="w-[90vw] max-w-[336px] sm:max-w-[450px] rounded-[28px] p-6 gap-10 bg-linear-to-b from-[#FAFAFC] from-0% to-[#F5F5F5] to-[80.54%]"
      >
        <DialogHeader className="items-center text-center">
          <ImageCustom
            src={SUCCESS_ICON}
            alt="SUCCESS_ICON"
            className="size-[120px] mb-5"
          />
          <DialogTitle className="text-[25px] font-semibold text-black">
            {t("congratulations")}
          </DialogTitle>
          <DialogDescription className="text-lg font-normal text-[#5C6268]">
            {t("yourPaymentIsCompleted")}
          </DialogDescription>
        </DialogHeader>

        <Button type="button" onClick={handleok}>
          {t("ok")}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CongratulationsModal;
