export class APIClientError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "APIClientError";
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  tag?: string;
  filters?: Record<string, string | string[] | number | boolean>;
};

// import { APIClientError } from "../api-client/error";

class ApiClient {
  // The base path for all API calls, pointing to our Next.js proxy route.
  #basePath = "/api/proxy";

  async #request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", headers = {}, body, tag, filters } = options;

    let url = `${this.#basePath}${path}`;

    if (typeof window === "undefined") {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      url = `${baseUrl}${url}`;
    }

    if (filters) {
      const queryParams = new URLSearchParams();
      for (const key in filters) {
        const value = filters[key];
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      }
      url = url + `?${queryParams.toString()}`;
      // console.log("This is url", url);
    }

    const config: RequestInit = {
      method,
      signal: AbortSignal.timeout(50000),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      next: {
        tags: tag ? [tag] : [],
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      const responseBody = await response.json();

      if (!response.ok) {
        const message = responseBody.message || response.statusText;
        throw new APIClientError(message, response.status);
      }

      return responseBody;
    } catch (error) {
      if (error instanceof APIClientError) {
        throw error;
      }
      throw new APIClientError("A network or unexpected error occurred.", 500);
    }
  }

  plans = {
    getAll: () =>
      this.#request<SubscriptionPlan[]>("/billing/plans", {
        tag: "plans",
      }),

    compare: () => this.#request<PlanComparison>(`/billing/plans/compare`),

    getbyId: (id: string) =>
      this.#request<SubscriptionPlan>(`/billing/plans/${id}`),
  };

  subscriptions = {
    checkout: (payload: CreateCheckoutSessionPayload) =>
      this.#request<CheckoutSession>(`/billing/checkout-session`, {
        method: "POST",
        body: payload,
      }),

    getCurrentSub: () =>
      this.#request<CurrentSubscription>(`/billing/subscription`),

    updateSub: (payload: UpdateSubscriptionPayload, subscriptionId: string) =>
      this.#request<CurrentSubscription>(
        `/billing/subscriptions/${subscriptionId}`,
        {
          method: "PUT",
          body: payload,
        },
      ),
    cancelSub: (
      subscriptionId: string,
      queryParams?: Record<string, string | boolean | string[]>,
    ) =>
      this.#request<CurrentSubscription>(
        `/billing/subscriptions/${subscriptionId}`,
        {
          filters: queryParams,
          method: "DELETE",
        },
      ),
  };

  history = {
    getAll: (queryParams?: Record<string, string | boolean | string[]>) =>
      this.#request<BillingHistory>(`/billing/history`, {
        filters: queryParams,
      }),
    getMultiServiceUsage: (
      queryParams?: Record<string, string | boolean | string[]>,
    ) =>
      this.#request<UsageDetails>(`/billing/usage/services`, {
        filters: queryParams,
      }),
    getServiceQuota: (
      serviceType: "sms" | "emails",
      queryParams?: Record<string, string | boolean | string[]>,
    ) =>
      this.#request<ServiceQuota>(`/billing/quota/${serviceType}`, {
        filters: queryParams,
      }),
    getBillingUsage: (
      business_id: string,
      queryParams?: Record<string, string | boolean | string[]>,
    ) =>
      this.#request<ServiceQuota>(`/billing/quota/${business_id}`, {
        filters: queryParams,
      }),
  };
}

export const apiClient = new ApiClient();
