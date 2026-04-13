import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray mb-6">
            Welcome to your
            <span className="text-teal-600">Harp Account Manager</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Universal User Management & Authentication System
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray mb-4">
              Hello, {session.user?.name || session.user?.email}!
            </h2>
            <p className="text-gray-600 mb-6">
              You have successfully logged in.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/profile">
                <Button variant="outline" className="w-full h-12">
                  View Profile
                </Button>
              </Link>
              <Link href="/profile/kyc">
                <Button variant="outline" className="w-full h-12">
                  Complete KYC
                </Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button variant="outline" className="w-full h-12">
                  Sign Out
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray mb-2">
                Secure Authentication
              </h3>
              <p className="text-sm text-gray-600">
                Multi-factor authentication with social login support
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray mb-2">
                Progressive Profiling
              </h3>
              <p className="text-sm text-gray-600">
                Gradual data collection for better user experience
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray mb-2">KYC/KYB Ready</h3>
              <p className="text-sm text-gray-600">
                Built-in verification workflows for compliance
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray mb-2">API Integration</h3>
              <p className="text-sm text-gray-600">
                Seamless integration with existing backend systems
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
