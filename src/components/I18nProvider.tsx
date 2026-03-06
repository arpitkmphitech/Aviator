"use client";

import "@/i18n/config";
import { initI18n } from "@/i18n/config";
import i18n from "i18next";
import { ReactNode, useEffect, useState } from "react";

const STORAGE_KEY = "i18nextLng";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const lng = (stored === "en" || stored === "de" ? stored : "en") as
      | "en"
      | "de";
    initI18n(lng);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    const handleLangChange = (lng: string) => {
      document.documentElement.lang = lng;
    };
    handleLangChange(i18n.language);
    i18n.on("languageChanged", handleLangChange);
    return () => i18n.off("languageChanged", handleLangChange);
  }, [ready]);

  if (!ready) return <>{children}</>;
  return <>{children}</>;
}
