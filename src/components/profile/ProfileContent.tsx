"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import EditProfile from "@/components/profile/EditProfile";
import MyProfile from "@/components/profile/MyProfile";
import TransactionHistory from "./TransactionHistory";
import AviatorSchool from "./AviatorSchool";
import Charter from "./Charter";
import ChangePassword from "./ChangePassword";
import ContactUs from "./ContactUs";
import AboutUs from "./AboutUs";
import TermsConditions from "./TermsConditions";
import PrivacyPolicy from "./PrivacyPolicy";
import SafetyRegulations from "./SafetyRegulations";
import { useProfileSection } from "./ProfileSectionContext";

const sectinos: Record<string, React.ComponentType | string> = {
  "my-profile": MyProfile,
  edit: EditProfile,
  transactions: TransactionHistory,
  "change-password": ChangePassword,
  "aviator-school": AviatorSchool,
  charter: Charter,
  contact: ContactUs,
  about: AboutUs,
  terms: TermsConditions,
  privacy: PrivacyPolicy,
  safety: SafetyRegulations,
  share: "Share App",
  logout: "Logout",
};

function getSectionFromPathname(pathname: string): string {
  return pathname === "/profile"
    ? "my-profile"
    : pathname.replace("/profile/", "") || "my-profile";
}

const ProfileContent = () => {
  const pathname = usePathname();
  const sectionFromRoute = getSectionFromPathname(pathname);
  const { pendingSection, setPendingSection } = useProfileSection() ?? {};
  const section = pendingSection ?? sectionFromRoute;

  useEffect(() => {
    if (pendingSection != null && sectionFromRoute === pendingSection) {
      setPendingSection?.(null);
    }
  }, [pendingSection, sectionFromRoute, setPendingSection]);

  const content = sectinos[section];
  if (!content) return <MyProfile key="my-profile" />;

  if (typeof content === "function") {
    const Component = content;
    return <Component key={section} />;
  }
  return null;
};

export default ProfileContent;
