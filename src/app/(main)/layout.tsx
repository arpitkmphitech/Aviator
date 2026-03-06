"use client";

import Footer from "@/layout/footer";
import Header from "@/layout/header";
import ImageCustom from "@/components/common/Image";
import { WISH_ICON } from "@/lib/images";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const showWishlist =
    pathname.startsWith("/home") || pathname.startsWith("/my-bookings");

  return (
    <div>
      <header className="sticky top-0 z-50 bg-white">
        <Header />
      </header>
      <div className="bg-[#F6F6F7] min-h-[calc(100vh-340px)]">{children}</div>
      <Footer />
      {showWishlist && (
        <Link
          href="/wishlist"
          aria-label="Wishlist"
          className="fixed bottom-0 sm:bottom-4 right-0 sm:right-6 z-50 flex size-[140px] items-center justify-center"
        >
          <ImageCustom
            src={WISH_ICON}
            alt="Wishlist"
            className="size-[140px] rounded-full object-contain"
          />
        </Link>
      )}
    </div>
  );
};

export default MainLayout;
