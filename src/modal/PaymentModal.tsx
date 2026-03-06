"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCallback, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "@/components/common/Button";
import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";
import { toast } from "sonner";

const PaymentForm = ({
  clientSecret,
  onSuccess,
  onClose,
}: {
  clientSecret: string;
  onSuccess: () => void;
  onClose: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation("home");
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;
      setIsConfirming(true);
      try {
        const { error } = await elements.submit();
        if (error) {
          toast.error(error.message);
          setIsConfirming(false);
          return;
        }
        const { error: confirmError } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url:
              typeof window !== "undefined"
                ? `${window.location.origin}${window.location.pathname}?payment=success`
                : "",
          },
        });
        if (confirmError) {
          toast.error(confirmError.message ?? "Payment failed");
          setIsConfirming(false);
          return;
        }
        onSuccess();
      } catch {
        toast.error("Payment failed. Please try again.");
      } finally {
        setIsConfirming(false);
      }
    },
    [stripe, elements, clientSecret, onSuccess]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement />
      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 min-h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white text-[#1F1F1F] font-semibold hover:bg-gray-50 disabled:opacity-50"
          onClick={onClose}
          disabled={isConfirming}
        >
          Cancel
        </button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!stripe || isConfirming}
        >
          {isConfirming ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            t("payNow")
          )}
        </Button>
      </div>
    </form>
  );
};

const PaymentModal = ({
  open,
  setOpen,
  clientSecret,
  publicKey,
  onPaymentSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  clientSecret: string | null;
  publicKey: string | null;
  onPaymentSuccess: () => void;
}) => {
  const { t } = useTranslation("home");

  const stripePromise = useMemo(
    () => (publicKey ? loadStripe(publicKey) : null),
    [publicKey]
  );

  const handleSuccess = useCallback(() => {
    setOpen(false);
    onPaymentSuccess();
  }, [setOpen, onPaymentSuccess]);

  const hasStripeData = Boolean(clientSecret && publicKey);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90vw] max-w-[436px] rounded-[28px] p-6 gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black">
            {t("payment")}
          </DialogTitle>
        </DialogHeader>
        {hasStripeData && stripePromise && clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: { theme: "stripe" },
            }}
          >
            <PaymentForm
              clientSecret={clientSecret}
              onSuccess={handleSuccess}
              onClose={() => setOpen(false)}
            />
          </Elements>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
