"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SESSION_EMAIL_KEY = "email";
const REDIRECT_TO = "/forgot-password";

type RequireForgotPasswordEmailProps = {
  children: React.ReactNode;
};

/**
 * Wraps pages that require the forgot-password email in sessionStorage (e.g. verify-otp, reset-password).
 * Redirects to /forgot-password if email is missing.
 */
export default function RequireForgotPasswordEmail({
  children,
}: RequireForgotPasswordEmailProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const email =
      typeof window !== "undefined"
        ? sessionStorage.getItem(SESSION_EMAIL_KEY)
        : null;
    if (!email) {
      router.replace(REDIRECT_TO);
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) return null;

  return <>{children}</>;
}
