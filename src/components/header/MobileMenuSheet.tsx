"use client";

import ImageCustom from "@/components/common/Image";
import { HeaderNav } from "@/components/header/HeaderNav";
import { MobileMenuSheetProps, NavLink } from "@/types/header";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MAIN_HEADER_LOGO } from "@/lib/images";

export function MobileMenuSheet({
  pathname,
  links,
  children,
}: MobileMenuSheetProps) {
  return (
    <Sheet>
      {children}
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 border-b border-[#ECECED] pb-5">
            <ImageCustom
              src={MAIN_HEADER_LOGO}
              alt="MAIN_HEADER_LOGO"
              className="object-contain sm:w-[150px] sm:h-[50px] w-[100px] h-[35px]"
            />
          </SheetTitle>
          <SheetDescription asChild>
            <HeaderNav
              links={links}
              pathname={pathname}
              className="flex flex-col gap-4 py-2"
            />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
