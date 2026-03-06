"use client";

import { useUser } from "@/hooks/useUser";
import { HeaderNavProps, NavLink } from "@/types/header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const isActive = (pathname: string, href: string) => pathname.startsWith(href);1

export function HeaderNav({ links, pathname, className }: HeaderNavProps) {
  const { t } = useTranslation("home");
  const { user } = useUser();
  const router = useRouter();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    if (user?.isGuest && (link.href === "/my-bookings" || link.href === "/chat")) {
      e.preventDefault();
      router.push("/login");
    }
  };
  return (
    <nav className={className}>
      {links.map((link) => (
        <Link
          href={link.href}
          onClick={(e) => handleNavigation(e, link)}
          key={link.href}
          className={`sm:text-lg text-base ${isActive(pathname, link.href)
            ? "text-[#1F1F1F] font-semibold"
            : "text-secondary font-normal"
            }`}
        >
          {t(link.label)}
        </Link>
      ))}
    </nav>
  );
}
