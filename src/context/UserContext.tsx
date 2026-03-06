"use client";
import PageLoader from "@/components/common/PageLoader";
import { useUserProfileDetail } from "@/hooks/profile/useUserProfileDetail";
import { useAuthStore } from "@/store/useAuthStore";
import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const UserContext = createContext({
  user: "",
  setUser: (user: any) => {},
  isLoading: false,
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const { token } = useAuthStore();

  const { userProfileDetail, isLoading } = useUserProfileDetail(!!token);
  const [user, setUser] = useState("");

  useEffect(() => {
    if (!userProfileDetail || isLoading || !token) return;
    setUser(userProfileDetail);
    i18n.changeLanguage(userProfileDetail?.lang);
  }, [userProfileDetail, isLoading]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {/* {isLoading ? (
        <div className="min-h-dvh flex items-center justify-center">
          <PageLoader />
        </div>
      ) : ( */}
      {children}
      {/* )} */}
    </UserContext.Provider>
  );
};

export default UserProvider;
