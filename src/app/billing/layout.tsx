import BillingHeader from "@/components/layout/header/billing-header";

export default async function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   redirect("/authV2/login?callbackUrl=/billing/dashboard");
  // }

  return (
    <div className="min-h-screen w-full flex flex-col relative bg-white">
      <BillingHeader />
      <main className="flex-1 py-10 px-4 sm:px-6">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
