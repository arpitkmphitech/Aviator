"use client";

import { RESET_SUCCESS_ICON } from "@/lib/images";
import SuccessScreen from "@/components/auth/SuccessScreen";

const ResetSuccess = () => {
  return (
    <SuccessScreen
      title="Successful"
      description="Your password has been reset successfully"
      buttonText="Login"
      redirectTo="/login"
      icon={RESET_SUCCESS_ICON}
    />
  );
};

export default ResetSuccess;
