"use client";

import { profileSidebarLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { hrefToSection, useProfileSection } from "./ProfileSectionContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/useUser";

type ProfileSidebarProps = {
  onLinkClick?: () => void;
  onLogoutClick?: () => void;
};

const ProfileSidebar = ({
  onLinkClick,
  onLogoutClick,
}: ProfileSidebarProps) => {
  const pathname = usePathname();
  const { t } = useTranslation("profile");
  const { user } = useUser();

  const hiddenLinksForGuest = [
    "/profile/my-profile",
    "/profile/transactions",
    "/profile/change-password",
    "/profile/logout"
  ];


  const visibleLinks =
    user?.isGuest
      ? profileSidebarLinks.filter(
        (link) => !hiddenLinksForGuest.includes(link.href)
      )
      : profileSidebarLinks;

  const { setPendingSection } = useProfileSection() ?? {};


  const handleLinkClick = (href: string) => {
    setPendingSection?.(hrefToSection(href));
    onLinkClick?.();
  };

  return (
    <nav className="flex flex-col bg-white overflow-hidden md:min-w-[320px] md:max-w-[320px]">
      <ul className="flex flex-col">
        {visibleLinks.map((link) => {
          const isLogout = link.href === "/profile/logout";
          const isGuest = user?.isGuest;
          const isActive =
            !isLogout &&
            (pathname === link.href ||
              (pathname === "/profile" &&
                link.href === "/profile/my-profile") ||
              (pathname === "/profile/edit" &&
                link.href === "/profile/my-profile"));

          return (
            <li key={link.href} className="border-b border-[#ECECED]">
              {isLogout ? (
                <button
                  type="button"
                  onClick={onLogoutClick}
                  className={cn(
                    "cursor-pointer block w-full px-6 py-4 text-left text-lg",
                    "text-[#F15E5E] hover:bg-[#FFF2F2]"
                  )}
                >
                  {t(link.label)}
                </button>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={cn(
                    "block px-6 py-4 text-left text-lg",
                    isActive
                      ? "bg-[#F6F6F7] text-[#7854B8] font-semibold border-l-4 border-[#7854B8]"
                      : "text-[#7F8892] hover:bg-[#F6F6F7]"
                  )}
                >
                  {t(link.label)}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default ProfileSidebar;
