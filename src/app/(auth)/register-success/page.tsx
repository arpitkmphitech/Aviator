"use client";

import { REGISTER_SUCCESS_ICON } from "@/lib/images";
import SuccessScreen from "@/components/auth/SuccessScreen";

const ResetSuccess = () => {
  return (
    <SuccessScreen
      title="Congratulations"
      description="Your profile has been created successfully"
      buttonText="Okay"
      redirectTo="/"
      icon={REGISTER_SUCCESS_ICON}
    />
  );
};

export default ResetSuccess;
