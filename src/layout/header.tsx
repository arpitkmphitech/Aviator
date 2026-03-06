"use client";

import ImageCustom from "@/components/common/Image";
import { HeaderNav } from "@/components/header/HeaderNav";
import { LanguageSelector } from "@/components/header/LanguageSelector";
import { MobileMenuSheet } from "@/components/header/MobileMenuSheet";
import { SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@/hooks/useUser";
import { DEFAULT_PROFILE_IMAGE, MAIN_HEADER_LOGO } from "@/lib/images";
import { HEADER_LINKS } from "@/lib/statics";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MOBILE_NAV_LINKS = [
  ...HEADER_LINKS,
  { label: "Profile", href: "/profile" },
];

const HamburgerIcon = () => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    fill="none"
    className="sm:hidden block size-6"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 7H21"
      stroke="#7854B8"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M3 12H21"
      stroke="#7854B8"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M3 17H21"
      stroke="#7854B8"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const Header: React.FC = () => {
  const pathname = usePathname();

  const { user } = useUser();

  return (
    <MobileMenuSheet pathname={pathname} links={MOBILE_NAV_LINKS}>
      <div className="flex justify-between items-center border border-b border-[#ECECED] py-[15px] 2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5">
        <div className="flex items-center gap-2">
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              suppressHydrationWarning
            >
              <HamburgerIcon />
            </button>
          </SheetTrigger>
          <Link href="/home">
            <ImageCustom
              src={MAIN_HEADER_LOGO}
              alt="MAIN_HEADER_LOGO"
              className="object-contain sm:w-[150px] sm:h-[50px] w-[100px] h-[35px]"
            />
          </Link>
        </div>
        <HeaderNav
          links={HEADER_LINKS}
          pathname={pathname}
          className="hidden sm:flex items-center gap-7 py-5"
        />
        <div className="flex items-center gap-5">
          <LanguageSelector />
          <Link href={user?.isGuest ? "/profile/aviator-school" : "/profile"}>
            <div className="flex items-center justify-center sm:w-[56px] sm:h-[56px] w-[46px] h-[46px] border bg-[#ECECED] border-[#ECECED] rounded-full">
              <ImageCustom
                src={user?.profile || DEFAULT_PROFILE_IMAGE}
                alt="DEFAULT_PROFILE_IMAGE"
                className="sm:w-[46px] sm:h-[46px] w-[36px] h-[36px] rounded-full"
              />
            </div>
          </Link>
        </div>
      </div>
    </MobileMenuSheet>
  );
};

export default Header;
