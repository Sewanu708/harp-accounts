import { apiClient } from "@/lib/billing-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useComparison() {
  return useQuery({
    queryKey: ["comparison"],
    queryFn: () => apiClient.plans.compare(),
  });
}

export function useAnalytics(serviceType?: string) {
  // Fallback to 'emails' if no product name or mapping found

  return useQuery<ServiceQuota | undefined>({
    queryKey: ["analytics", serviceType],
    queryFn: () => {
      if (!serviceType) {
        return Promise.resolve(undefined);
      }
      return apiClient.history.getServiceQuota(
        (serviceType as "emails" | "sms") ?? "emails",
      );
    },
    enabled: !!serviceType, // Only enable query if effectiveServiceType is available
  });
}

export function useMultiServiceUsage(
  queryParams?: Record<string, string | boolean | string[]>,
) {
  return useQuery({
    queryKey: ["multi-service-usage", queryParams],
    queryFn: () => apiClient.history.getMultiServiceUsage(queryParams),
  });
}

export function useHistory(
  queryParams?: Record<string, string | boolean | string[]>,
) {
  return useQuery({
    queryKey: ["history", queryParams],
    queryFn: () => apiClient.history.getAll(queryParams),
  });
}

export function usePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCheckoutSessionPayload) =>
      apiClient.subscriptions.checkout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

export function useCancelSub() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      queryParams,
    }: {
      id: string;
      queryParams: Record<string, string | boolean | string[]>;
    }) => apiClient.subscriptions.cancelSub(id, queryParams),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
  });
}

// get current plan

export function useCurrentPlan() {
  return useQuery({
    queryKey: ["current"],
    queryFn: () => apiClient.subscriptions.getCurrentSub(),
  });
}

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: () => apiClient.plans.getAll(),
  });
}
