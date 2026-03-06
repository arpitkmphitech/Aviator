import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

const PhotosModal = ({
  open,
  setOpen,
  images = [],
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  images: any[];
}) => {
  const { t } = useTranslation("home");
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (open) setSelectedIdx(0);
  }, [open]);

  if (!images.length) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-4xl w-[95%] py-0 pt-8 pb-8 rounded-[28px]"
      >
        <h2 className="text-center text-2xl font-bold text-black mb-2 border-b border-border pb-5">
          {t("photos")}
        </h2>
        <div className="flex flex-col md:flex-row w-full gap-4 md:gap-6 max-h-[85vh] overflow-auto">
          <div className="flex-1 flex items-center justify-center min-h-[200px] md:min-h-[400px] max-h-[320px] md:max-h-[520px] bg-white rounded-2xl shrink-0 overflow-hidden order-1 md:order-2">
            <img
              src={images[selectedIdx]?.imgUrl}
              alt={`Selected Photo ${selectedIdx + 1}`}
              className="size-full object-cover rounded-2xl shadow bg-white"
            />
          </div>
          <div className="flex md:grid md:grid-cols-2 flex-row gap-2 rounded-2xl p-3 md:p-4 overflow-x-auto md:overflow-y-auto md:max-h-[520px] md:min-w-[180px] border border-gray shrink-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden order-2 md:order-1">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img?.imgUrl}
                alt={`Photo ${idx + 1}`}
                className={`size-[70px] md:size-[120px] object-cover rounded-[8px] cursor-pointer border-2 shrink-0 ${
                  selectedIdx === idx ? "border-primary" : "border-transparent"
                } bg-white`}
                onClick={() => setSelectedIdx(idx)}
                style={{ transition: "border 0.2s" }}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotosModal;
