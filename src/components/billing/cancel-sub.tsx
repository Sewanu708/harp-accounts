"use client";

import { useEffect, useState } from "react";
import { AlertCircle, X, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useCancelSub } from "@/hooks/queries/use-pricing";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: CurrentSubscription;
}

export function CancelSubscriptionModal({
  isOpen,
  onClose,
  currentPlan,
}: CancelSubscriptionModalProps) {
  const { mutate: cancelSubscription, isPending, isSuccess, isError, reset } =
    useCancelSub();
  const [cancelImmediately, setCancelImmediately] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      onClose();
      reset();
    }
  }, [isSuccess, onClose, reset]);

  const handleConfirm = () => {
    cancelSubscription({
      id: currentPlan?.id ?? "",
      queryParams: { immediately: cancelImmediately },
    });
  };

  if (!isOpen) return null;

  const formattedDate = currentPlan?.nextInvoiceDate
    ? format(new Date(currentPlan.nextInvoiceDate), "MMMM d, yyyy")
    : "N/A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-destructive/10 p-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Cancel Subscription?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You&apos;re about to cancel your {currentPlan?.plan?.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6 space-y-4">
          {isError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
              <XCircle className="h-4 w-4" />
              <span>Failed to cancel subscription. Please try again.</span>
            </div>
          )}
          <div className="rounded-lg bg-secondary/30 p-4">
            <p className="text-sm text-foreground">
              When you cancel, you&apos;ll lose access to all premium features
              at the end of your current billing period.
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/20">
              <Checkbox
                checked={!cancelImmediately}
                onCheckedChange={() => setCancelImmediately(false)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  Cancel at end of billing period
                </p>
                <p className="text-xs text-muted-foreground">
                  Keep access until {formattedDate}. No refunds will be issued.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/20">
              <Checkbox
                checked={cancelImmediately}
                onCheckedChange={() => setCancelImmediately(true)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">Cancel immediately</p>
                <p className="text-xs text-muted-foreground">
                  Lose access to premium features right away. No refunds will be
                  issued.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 bg-transparent"
          >
            Keep Subscription
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? "Cancelling..." : "Cancel Subscription"}
          </Button>
        </div>
      </div>
    </div>
  );
}
