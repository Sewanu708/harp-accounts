interface Address {
  country: string;
  postal_code: string;
  state: string;
  city: string;
  line2: string;
  line1: string;
}

type Metadata = Record<string, string | number | boolean | null>;

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceAmount: number;
  currency: string;
  interval: string;
  emailQuota: number;
  overageRate: number;
  features: string[];
  maxApiKeys: number;
  maxDomains: number;
  isPopular: boolean;
  sortOrder: number;
  status: "active" | "inactive";
  stripeProductId: string;
  stripePriceId: string;
  createdAt: string;
  updatedAt: string;
  serviceQuotas: ServiceQuotas;
}

interface ServiceQuotas {
  sms: {
    overageRate: number;
    quota: number;
  };
  emails: {
    overageRate: number;
    quota: number;
  };
}

interface CreateSubscriptionPlanPayload {
  name: string;
  slug: string;
  description: string;
  priceAmount: number;
  currency: string;
  interval: string;
  emailQuota: number;
  overageRate: number;
  features: string[];
  maxApiKeys: number;
  maxDomains: number;
  isFreeTier?: boolean;
  isPopular?: boolean;
  stripePriceId?: string;
  stripeProductId?: string;
  sortOrder?: number;
}

interface CreateCustomerPayload {
  email: string;
  name: string;
  business_id: string;
  address?: Address;
  phone?: string;
  metadata?: Metadata;
}

interface SubscriptionPlanInfo {
  interval: string;
  currency: string;
  priceAmount: number;
  emailQuota: number;
  name: string;
  id: string;
}

interface SubscriptionUsage {
  emailsSent: number;
  emailsRemaining: number;
  overageEmails: number;
  quotaPercentage: number;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  planLimits: Record<string, unknown>;
}

interface Subscription {
  id: string;
  business_id: string;
  customerId: string;
  status:
    | "incomplete"
    | "incomplete_expired"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "paused";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  plan: SubscriptionPlanInfo;
  usage: SubscriptionUsage;
  cancelAtPeriodEnd: boolean;
  trialEnd: string;
  nextInvoiceDate: string;
}

interface CreateSubscriptionPayload {
  business_id: string;
  customerId: string;
  planId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  paymentMethodId?: string;
  trialDays?: number;
  status?:
    | "incomplete"
    | "incomplete_expired"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "paused";
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  trialEnd?: string;
  metadata?: Metadata;
}

interface UpdateSubscriptionPayload {
  planId?: string;
  status?:
    | "incomplete"
    | "incomplete_expired"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "paused";
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  trialEnd?: string;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string;
  alertSettings?: {
    emailNotifications?: boolean;
    sendOverageAlerts?: boolean;
    quotaWarningAt?: number;
  };
  metadata?: Metadata;
}

interface CreateCheckoutSessionPayload {
  customerId: string;
  planId: string;
  successUrl: string;
  cancelUrl: string;
  stripeCustomerId?: string;
  trialDays?: number;
  metadata?: Metadata;
}

interface CheckoutSession {
  sessionId: string;
  checkoutUrl: string;
}

interface UpdateUsagePayload {
  emailsSent: number;
}

interface CurrentPeriodUsage {
  quotaUsagePercentage: number;
  overageAmount: number;
  overageEmails: number;
  emailsRemaining: number;
  emailsSent: number;
}

interface ProjectedUsage {
  estimatedOverageAmount: number;
  estimatedOverage: number;
  emailsAtEndOfPeriod: number;
}

interface HistoricalUsage {
  last6Months: Record<string, unknown>[];
}

interface Alert {
  [key: string]: unknown;
}

interface ServiceQuota {
  currentUsage: {
    usagePercentage: number;
    overage: number;
    remaining: number;
    used: number;
  };
  hasActiveSubscription: true;
  planName: string;
  overageRate: number;
  quota: number;
  serviceType: string;
}

interface SubscriptionPlanComparison {
  isCurrentPlan: boolean;
  estimatedMonthlyCost: number;
  id: string;
  name: string;
  slug: string;
  priceAmount: number;
  currency: string;
  interval: string; // "monthly" | "yearly"
  emailQuota: number;
  overageRate: number;
  features: string[];
  maxApiKeys: number;
  maxDomains: number;
  isPopular: boolean;
}

interface PlanComparison {
  plans: SubscriptionPlanComparison[];
  currentUsage: Record<string, unknown>;
  recommendations: Record<string, unknown>;
}

type Invoice = {
  id: string;
  invoiceNumber: string;
  status: string;
  total: number;
  amountDue: number;
  currency: string;
  dueDate: string;
  paidAt: string;
  periodStart: string;
  periodEnd: string;
  emailsSentInPeriod: number;
  overageEmails: number;
  overageAmount: number;
  hostedInvoiceUrl: string;
  invoicePdf: string;
};

interface BillingHistory {
  invoices: Invoice[];
  totalCount: number;
  hasMore: boolean;
}

interface PlanDetails {
  interval: string;
  currency: string;
  priceAmount: number;
  emailQuota: number;
  name: string;
  id: string;
}

interface UsageDetails {
  totalOverageCost: number;
  billingPeriod: Record<string, string>;
  services: Record<string, string>;
}

interface CurrentSubscription {
  id: string;
  business_id: string;
  customerId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  plan: PlanDetails;
  usage: UsageDetails;
  cancelAtPeriodEnd: boolean;
  trialEnd: string;
  nextInvoiceDate: string;
}

interface BillingUsage {
  business_id: string;
  subscription: {
    period: {
      end: string;
      start: string;
    };
    plan: {
      interval: string;
      currency: string;
      price: number;
      name: number;
    };
    status: string;
  };
  usage: {
    emails: {
      sent: number;
      remaining: number;
      overage: number;
      quota: number;
      overageRate: number;
      usagePercentage: number;
    };
    sms: {
      sent: number;
      remaining: number;
      overage: number;
      quota: number;
      overageRate: number;
      usagePercentage: number;
    };
  };
  totals: {
    overageCost: number;
  };
}
