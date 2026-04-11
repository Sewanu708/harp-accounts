"use client";

import { HarpButton } from "@/components/harp-ui/harp-button";
import Image from "next/image";
import { useRouter } from "next/navigation";

function PasswordUpdatedView() {
  const router = useRouter();

  return (
    <div className="flex w-full max-w-[477px] flex-col items-center gap-[38px]">
      {/* Illustration + text */}
      <div className="flex flex-col items-center gap-[24px]">
        <Image
          src="/illustrations/password-updated.png"
          alt="Password updated"
          width={110}
          height={110}
          priority
        />

        <div className="flex flex-col items-center gap-[6px] text-center tracking-[-0.5px]">
          <h1 className="text-[28px] font-bold leading-[30.8px] text-foreground-strong">
            Password updated
          </h1>
          <p className="w-full max-w-[393px] text-[16px] font-medium text-foreground-subtle">
            Your password has been successfully reset.
          </p>
        </div>
      </div>

      {/* Continue to login — secondary variant, w-[384px] from Figma */}
      <div className="w-full max-w-[384px]">
        <HarpButton
          type="button"
          variant="secondary"
          size="md"
          isFullWidth
          onClick={() => router.push("/authV2/login")}
        >
          Continue to login
        </HarpButton>
      </div>
    </div>
  );
}

export default PasswordUpdatedView;
