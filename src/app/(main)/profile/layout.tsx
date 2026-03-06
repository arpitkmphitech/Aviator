"use client";

import ProfileSidebar from "@/components/profile/ProfileSidebar";
import {
  ProfileSectionProvider,
  useProfileSection,
} from "@/components/profile/ProfileSectionContext";
import { profileSidebarLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SignoutModal from "@/modal/SignoutModal";
import { useTranslation } from "react-i18next";
import useScrollToTop from "@/hooks/useScrollToTop";
import Button from "@/components/common/Button";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

function getSectionFromPathname(pathname: string): string {
  return pathname === "/profile"
    ? "my-profile"
    : pathname.replace("/profile/", "") || "my-profile";
}

function getPageLabel(section: string): string {
  if (section === "edit") return "Edit Profile";
  const link = profileSidebarLinks.find(
    (l) => l.href === `/profile/${section}`
  );
  return link?.label ?? "My Profile";
}

function ProfileLayoutInner({ children }: { children: React.ReactNode }) {
  useScrollToTop();
  const pathname = usePathname();
  const { t } = useTranslation("profile");
  const { pendingSection } = useProfileSection() ?? {};
  const section = pendingSection ?? getSectionFromPathname(pathname);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const isEditPage = section === "edit";
  const pageLabel = getPageLabel(section);
  const isMyProfile = section === "my-profile";

  const handleLinkClick = () => setShowSidebar(false);

  const { user, setUser } = useUser();
  const router = useRouter();
  return (
    <>
      <div className="bg-white py-[15px] 2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5">
        <div className="flex justify-between items-center">
          <h1 className="text-[30px] font-semibold text-black mt-5 mb-10">
            {t("profile")}
          </h1>
          {user?.isGuest && (
            // <div className="border-b border-[#ECECED] px-6 py-4">
            <Button
              className="block w-fit"
              onClick={() => {
                Cookies.remove("token");
                sessionStorage.removeItem("user_id");
                router.replace("/login")
                setUser(null);
              }}
            >
              {t("login")}
            </Button>
            // </div>
          )}
        </div>


        <div className="flex flex-col md:flex-row gap-6 md:gap-[62px] mb-11">
          <div className={cn("md:block", !showSidebar && "hidden")}>
            <ProfileSidebar
              onLinkClick={handleLinkClick}
              onLogoutClick={() => setShowLogoutDialog(true)}
            />
          </div>

          <div
            className={cn("flex-1 min-w-0", showSidebar && "hidden md:block")}
          >
            {!showSidebar && (
              <button
                type="button"
                onClick={() => setShowSidebar(true)}
                className="md:hidden flex items-center gap-2 text-[#7854B8] font-medium mb-4 hover:opacity-80"
                aria-label="Back to menu"
              >
                <ChevronLeft className="size-5" />
                <span>{t("back")}</span>
              </button>
            )}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex justify-center items-center gap-3">
                {isEditPage && (
                  <Link href="/profile/my-profile">
                    <ArrowLeft />
                  </Link>
                )}
                <h2 className="text-[26px] font-medium text-black">
                  {t(pageLabel)}
                </h2>
              </div>
              {isMyProfile && !isEditPage && (
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center gap-2 text-black font-medium text-lg underline underline-offset-2"
                >
                  {t("editProfile")}
                </Link>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>

      {showLogoutDialog && (
        <SignoutModal
          showLogoutDialog={showLogoutDialog}
          setShowLogoutDialog={setShowLogoutDialog}
        />
      )}
    </>
  );
}

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProfileSectionProvider>
      <ProfileLayoutInner>{children}</ProfileLayoutInner>
    </ProfileSectionProvider>
  );
};

export default ProfileLayout;
