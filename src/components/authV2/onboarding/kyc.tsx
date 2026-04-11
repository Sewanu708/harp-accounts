"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { harpToast as toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

import { apiClient } from "@/lib/api-client";
import { HarpInput } from "@/components/harp-ui/input";
import { HarpSelect } from "@/components/harp-ui/select";
import { HarpButton } from "@/components/harp-ui/harp-button";
import {
  INDUSTRY_OPTIONS,
  ROLE_OPTIONS,
  TEAM_SIZE_OPTIONS,
} from "@/lib/constant";
import { kycSchemav2 } from "@/lib/validations";
import { HarpCountrySelectorV2 } from "@/components/forms/HarpCountrySelectorV2";

type FormValues = z.infer<typeof kycSchemav2>;

export default function KycFormV2() {
  const router = useRouter();
  const { data: session }: any = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(kycSchemav2),
  });

  const handleCountrySelect = (data: any) => {
    setValue("country", data?.label || "");
  };

  const onSubmit = async (data: FormValues) => {
    const token = session?.token;
    if (!token) {
      toast.error("Authorization token is missing. Please log in again.");
      router.push("/authV2/login");
      return;
    }

    // Prepend https:// to website if it's provided and doesn't already have a protocol
    let formattedWebsite = data.website;
    if (formattedWebsite && !formattedWebsite.startsWith("http")) {
      formattedWebsite = `https://${formattedWebsite}`;
    }

    try {
      const response = await apiClient.submitKYC(
        {
          business_name: data.businessName,
          website: formattedWebsite,
          address: data.address,
          country: data.country,
          industry: data.industry,
          role: data.role,
          team_size: data.teamSize,
          phone: data.phone || "", // Optional field in API
          employee_size: data.teamSize, // Also used here for compatibility
          comms_per_month: "0",
        },
        token,
      );

      if (response.success) {
        toast.success("Company details saved.");
        router.push("/authV2/pricing");
      } else {
        toast.error(response.error || "Something went wrong. Try again.");
      }
    } catch {
      toast.error("Failed to save company details. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-[50px]">
      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-[6px]">
        <p className="font-mono text-[12px] font-medium uppercase tracking-[0.5px] text-harp-grey-31">
          Step 1 of 2 — Your workspace
        </p>
        <h1 className="text-[28px] font-bold leading-[30.8px] tracking-[-1px] text-foreground">
          Set up your company
        </h1>
      </div>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[40px]"
        noValidate
      >
        <div className="flex flex-col gap-[40px]">
          {/* Row 1 — Business name + Website */}
          <div className="flex flex-col sm:flex-row items-start gap-[24px] sm:gap-[40px] w-full">
            <div className="w-full sm:w-[384px]">
              <HarpInput
                id="businessName"
                label="Business name"
                required
                placeholder="Nova Corp"
                state={errors.businessName ? "error" : "default"}
                errorMessage={errors.businessName?.message}
                {...register("businessName")}
              />
            </div>
            <div className="w-full sm:w-[384px]">
              <HarpInput
                id="website"
                label="Website"
                required
                placeholder="nova.io"
                prefix="https://"
                state={errors.website ? "error" : "default"}
                errorMessage={errors.website?.message}
                {...register("website")}
              />
            </div>
          </div>

          {/* Row 2 — Address + Country */}
          <div className="flex flex-col sm:flex-row items-start gap-[24px] sm:gap-[40px] w-full">
            <div className="w-full sm:w-[384px]">
              <HarpInput
                id="address"
                label="Company address"
                placeholder="123 Main Street, Lagos, Nigeria"
                state={errors.address ? "error" : "default"}
                errorMessage={errors.address?.message}
                {...register("address")}
              />
            </div>
            <div className="w-full sm:w-[384px]">
              <HarpCountrySelectorV2
                label="Country"
                value={watch("country")}
                onChange={(country) =>
                  setValue("country", country?.code ?? "", {
                    shouldValidate: true,
                  })
                }
                errorMessage={errors.country?.message}
              />
            </div>
          </div>

          {/* Row 3 — Industry + Role */}
          <div className="flex flex-col sm:flex-row items-start gap-[24px] sm:gap-[40px] w-full">
            <div className="w-full sm:w-[384px]">
              <HarpSelect
                label="Industry"
                placeholder="Select"
                options={INDUSTRY_OPTIONS}
                value={watch("industry")}
                onValueChange={(val) => setValue("industry", val)}
                state={errors.industry ? "error" : "default"}
                errorMessage={errors.industry?.message}
              />
            </div>
            <div className="w-full sm:w-[384px]">
              <HarpSelect
                label="Your role"
                placeholder="Select"
                options={ROLE_OPTIONS}
                value={watch("role")}
                onValueChange={(val) => setValue("role", val)}
                state={errors.role ? "error" : "default"}
                errorMessage={errors.role?.message}
              />
            </div>
          </div>

          {/* Row 4 — Team size + Phone */}
          <div className="flex flex-col sm:flex-row items-start gap-[24px] sm:gap-[40px] w-full">
            <div className="w-full sm:w-[384px]">
              <HarpSelect
                label="Team size"
                placeholder="Select"
                options={TEAM_SIZE_OPTIONS}
                value={watch("teamSize")}
                onValueChange={(val) => setValue("teamSize", val)}
                defaultValue="2-10"
                state={errors.teamSize ? "error" : "default"}
                errorMessage={errors.teamSize?.message}
              />
            </div>
            <div className="w-full sm:w-[384px]">
              <HarpInput
                id="phone"
                type="tel"
                label="Phone (Optional)"
                placeholder="Phone Number"
                state={errors.phone ? "error" : "default"}
                errorMessage={errors.phone?.message as string}
                {...register("phone")}
              />
            </div>
          </div>
        </div>

        {/* ── Actions ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-[16px] border-t border-harp-azure-89 pt-[32px]">
          <HarpButton
            type="submit"
            variant="primary"
            size="md"
            rightIcon={<ChevronRight className="size-4" />}
            isLoading={isSubmitting}
          >
            Continue to Pricing
          </HarpButton>
        </div>
      </form>
    </div>
  );
}
