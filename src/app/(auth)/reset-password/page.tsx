"use client";

import React from "react";
import RequireForgotPasswordEmail from "@/components/auth/RequireForgotPasswordEmail";
import ResetPassword from "@/components/auth/ResetPassword";

const ResetPasswordPage: React.FC = () => {
  return (
    <RequireForgotPasswordEmail>
      <ResetPassword />
    </RequireForgotPasswordEmail>
  );
};

export default ResetPasswordPage;
