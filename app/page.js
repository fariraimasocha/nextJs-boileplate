import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Revolutionize Your Farm Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            The most comprehensive and user-friendly farm management solution. Streamline operations, increase productivity, and make data-driven decisions.
          </p>
          <div className="flex gap-4 mt-4">
            <Button size="lg" asChild>
              <Link href="/auth/signUp">
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signIn">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
