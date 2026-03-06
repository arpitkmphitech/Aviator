import Button from "@/components/common/Button";
import ImageCustom from "@/components/common/Image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/hooks/useUser";
import { LOGOUT_ICON } from "@/lib/images";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

const SignoutModal = ({
  showLogoutDialog,
  setShowLogoutDialog,
}: {
  showLogoutDialog: boolean;
  setShowLogoutDialog: (show: boolean) => void;
}) => {
  const router = useRouter();
  const { t } = useTranslation("profile");
  const { setUser } = useUser();
  const handleLogoutConfirm = () => {
    setShowLogoutDialog(false);
    Cookies.remove("token");
    sessionStorage.removeItem("user_id");
    setUser(null);
    router.push("/login");

  };

  return (
    <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
      <DialogContent
        showCloseButton={false}
        className="w-[90vw] max-w-[336px] sm:max-w-[660px] rounded-[28px] p-6"
      >
        <DialogHeader className="items-center text-center">
          <ImageCustom
            src={LOGOUT_ICON}
            alt="Logout icon"
            className="size-[120px] mb-5"
          />
          <DialogTitle className="text-[25px] font-semibold text-black">
            {t("logOut")}
          </DialogTitle>
          <DialogDescription className="text-lg font-normal text-[#5C6268]">
            {t("logoutConfirm")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            onClick={() => setShowLogoutDialog(false)}
            className="font-semibold bg-[#ECECED] text-[#7F8892]"
          >
            {t("cancel")}
          </Button>
          <Button type="button" onClick={handleLogoutConfirm}>
            {t("yes")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignoutModal;
