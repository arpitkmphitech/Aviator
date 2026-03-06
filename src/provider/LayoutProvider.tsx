"use client";
import React, { Suspense } from "react";
import QueryProvider from "./QueryProvider";
import { Toaster } from "sonner";
import { I18nProvider } from "@/components/I18nProvider";
import PageLoader from "@/components/common/PageLoader";

const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const Loading = () => {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <PageLoader />
      </div>
    );
  };
  return (
    <QueryProvider>
      <I18nProvider>
        <Suspense fallback={<Loading />}>
          {children}
          <Toaster
            visibleToasts={1}
            duration={2000}
            richColors
            position="top-right"
          />
        </Suspense>
      </I18nProvider>
    </QueryProvider>
  );
};

export default LayoutProvider;
