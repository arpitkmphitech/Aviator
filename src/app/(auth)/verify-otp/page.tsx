"use client";

import React from "react";
import RequireForgotPasswordEmail from "@/components/auth/RequireForgotPasswordEmail";
import VerifyOTP from "@/components/auth/VerifyOTP";

const VerifyOtpPage: React.FC = () => {
  return (
    <RequireForgotPasswordEmail>
      <VerifyOTP />
    </RequireForgotPasswordEmail>
  );
};

export default VerifyOtpPage;
