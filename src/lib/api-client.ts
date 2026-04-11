/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

interface ApiResponse<T = any> {
  // account: any;
  // token: any;
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_HARP_CORE_API_URL || "",
  ) {
    // console.log(baseUrl)
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const { method = "GET", headers = {}, body, timeout = 20000 } = options;

    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseUrl}${endpoint}`;

    // console.log({url})
    const config: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
      signal: AbortSignal.timeout(timeout),
    };

    if (body && method !== "GET") {
      config.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    try {
      console.log({ config });
      const response = await fetch(url, config);
      console.log({ response });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || "Request failed",
          // account: null,
          // token: null,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("API Request Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
        // account: null,
        // token: null,
      };
    }
  }

  // Authentication endpoints

  async signup(userData: {
    email: string;
    product: string;
    redirect: string;
    applicationUrl?: string;
  }) {
    return this.request("/auth/signup", {
      method: "POST",
      body: userData,
      headers: {
        "x-harp-redirect": userData.redirect,
        "x-harp-product": userData.product!,
        "x-harp-product-url": userData.applicationUrl!,
      },
    });
  }

  async verifyEmail(token: string) {
    return this.request("/auth/verify_email", {
      method: "POST",
      body: { token },
    });
  }

  async setPassword({ token, password }: { token: string; password: string }) {
    return this.request<{ success: string }>("/auth/set_password", {
      method: "POST",
      body: { password },
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  async login(credentials: { email: string; password: string }, headers: any) {
    return this.request<any>("/auth/login", {
      method: "POST",
      body: credentials,
      headers,
    });
  }

  async submitKYC(
    userData: {
      country: string;
      business_name: string;
      website?: string;
      phone?: string;
      employee_size?: string;
      comms_per_month?: string;
      address?: string;
      industry?: string;
      role?: string;
      team_size?: string;
    },
    token: string,
  ) {
    return this.request("/auth/company-info", {
      method: "POST",
      body: userData,
      headers: {
        Authorization: `${token}`,
      },
    });
  }

  async resendVerification(data: { identifier: string; type: string }) {
    return this.request("/auth/resend_verification", {
      method: "POST",
      body: data,
    });
  }

  async resetPassword(email: string) {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: { email },
    });
  }

  async setNewPassword(password: string, token: string) {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: { password },
      headers: {
        Authorization: `${token}`,
      },
    });
  }

  async updateProfile(profileData: any) {
    return this.request("/api/auth/proxy?action=update-profile", {
      method: "PUT",
      body: profileData,
    });
  }

  // async submitKYC(kycData: any) {
  //   const token = localStorage.getItem("authToken");
  //   return this.request("/api/auth/kyc", {
  //     method: "POST",
  //     body: kycData,
  //     headers: {
  //       Authorization: `${token}`,
  //     },
  //   });
  // }
}

export const apiClient = new ApiClient();
export const authClient = new ApiClient(
  process.env.NEXT_PUBLIC_HARP_CORE_AUTH_URL,
);
