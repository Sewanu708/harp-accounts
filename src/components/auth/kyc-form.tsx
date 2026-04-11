  /* eslint-disable @typescript-eslint/no-explicit-any */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  "use client";

  import { Suspense, useState } from "react";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useRouter } from "next/navigation";
  import Link from "next/link";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardHeader } from "@/components/ui/card";
  import { Checkbox } from "@/components/ui/checkbox";
  import { AuthInput } from "@/components/forms/auth-input";
  import { kycSchema, type KycFormData } from "@/lib/validations";
  import { apiClient } from "@/lib/api-client";
  import { Loader2 } from "lucide-react";
  import { toast } from "sonner";
  import HarpCountrySelector from "../forms/HarpCountrySelector";
  import { useSession } from "next-auth/react";
  import { useHarp } from "@/contexts/harp-context";

  export function KycForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session, status }: any = useSession();


    const { application, applicationUrl } = useHarp()

    const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
      watch,
    } = useForm<KycFormData>({
      resolver: zodResolver(kycSchema),
    });

    const acceptTerms = watch("acceptTerms");

    const handleCountrySelect = (data: { label: string }) => {
      // console.log({ data })
      setValue("country", data.label)
    };

    const onSubmit = async (data: KycFormData) => {
      setIsLoading(true);

      try {
        const token = session?.token;

        if (!token) {
          toast.error("Authorization token is missing. Please log in again.");
          router.push("/auth/login");
          return;
        }

        const response = await apiClient.submitKYC(
          {
            country: data.country,
            business_name: data.business_name,
            website: data.website,
            phone: data.phone,
            employee_size: "10-100",
            comms_per_month: "3000"
          },
          session?.token
        );

        if (response.success) {
          toast.success("KYC submitted successfully.");
          router.replace(`${applicationUrl!}?auth=${token}`);
        } else {
          toast.error(
            response.error || "Something went wrong. Please try again."
          );
        }
      } catch (error) {
        console.log(error)
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Suspense>
      <Card className="border-0 shadow-none">
        <CardHeader className="text-center pb-6">
          <h2 className="text-lg font-medium text-gray">Provide business details.</h2>
          <p className="text-sm text-gray-600 mt-2">
            Just a few details about your business. and you&apos;re all set.
          </p>
        </CardHeader>

        <CardContent className="space-y-8 px-2 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="w-full" >
              <HarpCountrySelector sx={{ width: '100%' }} onChange={handleCountrySelect} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <AuthInput
                {...register("business_name")}
                id="business_name"
                type="text"
                label="Business Name"
                placeholder="Business Name"
                error={errors.business_name?.message}
                disabled={isLoading}
              />

              <AuthInput
                {...register("phone")}
                id="phone"
                type="text"
                label="Phone"
                placeholder="Phone"
                error={errors.phone?.message}
                disabled={isLoading}
              />
            </div>

            <AuthInput
              {...register("website")}
              id="website"
              type="website"
              label="Website"
              placeholder="Website"
              error={errors.website?.message}
              disabled={isLoading}
            />

            <AuthInput
              {...register("phone")}
              id="phone"
              type="tel"
              label="Phone (Optional)"
              placeholder="Phone Number"
              error={errors.phone?.message}
              disabled={isLoading}
            />


            <div className="flex items-center space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={acceptTerms}
                onCheckedChange={(checked) =>
                  setValue("acceptTerms", checked as boolean)
                }
                disabled={isLoading}
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-teal-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-teal-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>
            )}

            <Button
              type="submit"
              className="w-full auth-button auth-button-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving your information...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              href="/auth/login"
              className="text-teal-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
      </Suspense>
    );
  }
