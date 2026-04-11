"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { useHistory } from "@/hooks/queries/use-pricing";
import { CurrencyFormatters, currencyFormatters, formatDate } from "@/lib/utils";

function getStatusBadge(status: string) {
  const variants: Record<string, { label: string; className: string }> = {
    paid: { label: "Paid", className: "bg-success/10 text-success border-success/20" },
    pending: { label: "Pending", className: "bg-accent/10 text-accent border-accent/20" },
    overdue: {
      label: "Overdue",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };
  const variant = variants[status] ?? variants.pending;
  return (
    <Badge variant="outline" className={variant.className}>
      {variant.label}
    </Badge>
  );
}

export default function BillingHistory() {
  const { data } = useHistory();

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-bold text-foreground-strong">Billing History</CardTitle>
        <CardDescription className="text-foreground-subtle">
          A complete history of your billing and payments
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground-subtle/70">Invoice</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground-subtle/70">Billing Period</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-foreground-subtle/70">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-foreground-subtle/70">Usage</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-foreground-subtle/70">Overage</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-foreground-subtle/70">Total</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-foreground-subtle/70">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-foreground-strong">{invoice.invoiceNumber}</span>
                      <span className="text-xs text-foreground-subtle">
                        {invoice.paidAt
                          ? `Paid ${formatDate(invoice.paidAt)}`
                          : `Due ${formatDate(invoice.dueDate)}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground-strong">
                      <div>{formatDate(invoice.periodStart)}</div>
                      <div className="text-xs text-foreground-subtle">
                        to {formatDate(invoice.periodEnd)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(invoice.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-sm font-bold text-foreground-strong">
                        {invoice.emailsSentInPeriod.toLocaleString()}
                      </span>
                      {invoice.overageEmails > 0 && (
                        <span className="text-xs text-foreground-subtle">
                          {invoice.overageEmails.toLocaleString()} overage
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {invoice.overageAmount > 0 ? (
                      <span className="text-sm font-semibold text-accent">
                        {currencyFormatters[invoice.currency as keyof CurrencyFormatters]?.(invoice.overageAmount)}
                      </span>
                    ) : (
                      <span className="text-sm text-foreground-subtle/50">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-sm font-bold text-foreground-strong">
                        {currencyFormatters[invoice.currency as keyof CurrencyFormatters]?.(invoice.total)}
                      </span>
                      {invoice.amountDue > 0 && (
                        <span className="text-xs font-semibold text-destructive">
                          {currencyFormatters[invoice.currency as keyof CurrencyFormatters]?.(invoice.amountDue)} due
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-foreground-subtle hover:text-primary hover:bg-primary/5"
                        onClick={() => window.open(invoice.hostedInvoiceUrl, "_blank")}
                      >
                        <ExternalLink className="size-4" />
                        <span className="sr-only">View invoice</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-foreground-subtle hover:text-primary hover:bg-primary/5"
                        onClick={() => window.open(invoice.invoicePdf, "_blank")}
                      >
                        <Download className="size-4" />
                        <span className="sr-only">Download PDF</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
