import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enProfile from "../locales/en/profile.json";
import deProfile from "../locales/de/profile.json";
import enHome from "../locales/en/home.json";
import deHome from "../locales/de/home.json";
import enWishlist from "../locales/en/wishlist.json";
import deWishlist from "../locales/de/wishlist.json";

export const defaultNS = "profile" as const;
export const supportedLngs = ["en", "de"] as const;
export type SupportedLng = (typeof supportedLngs)[number];

const resources = {
  en: { profile: enProfile, home: enHome, wishlist: enWishlist },
  de: { profile: deProfile, home: deHome, wishlist: deWishlist },
};

export function initI18n(lng: string = "en") {
  if (i18n.isInitialized) {
    i18n.changeLanguage(lng);
    return i18n;
  }
  i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: "en",
    defaultNS,
    ns: ["profile", "home", "wishlist"],
    interpolation: { escapeValue: false },
  });
  i18n.on("languageChanged", (lng) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("i18nextLng", lng);
      } catch {
        console.error("Failed to save language to localStorage");
      }
    }
  });
  return i18n;
}

if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem("i18nextLng");
    const lng = stored === "de" || stored === "en" ? stored : "en";
    initI18n(lng);
  } catch {
    initI18n("en");
  }
} else {
  initI18n("en");
}
