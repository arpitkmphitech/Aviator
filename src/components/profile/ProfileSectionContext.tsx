"use client";

import { createContext, useContext, useMemo, useState } from "react";

type ProfileSectionContextValue = {
  pendingSection: string | null;
  setPendingSection: (section: string | null) => void;
};

const ProfileSectionContext = createContext<ProfileSectionContextValue | null>(
  null
);

export function ProfileSectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pendingSection, setPendingSection] = useState<string | null>(null);
  const value = useMemo(
    () => ({ pendingSection, setPendingSection }),
    [pendingSection]
  );
  return (
    <ProfileSectionContext.Provider value={value}>
      {children}
    </ProfileSectionContext.Provider>
  );
}

export function useProfileSection() {
  const ctx = useContext(ProfileSectionContext);
  return ctx;
}

export function hrefToSection(href: string): string {
  if (href === "/profile" || href === "/profile/my-profile")
    return "my-profile";
  return href.replace("/profile/", "") || "my-profile";
}
