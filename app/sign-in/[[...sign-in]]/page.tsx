import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { clerkAppearance } from "@/lib/clerkAppearance";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col justify-center items-center px-4 py-12">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="font-space-grotesk text-2xl font-semibold tracking-tight text-[var(--ink)] hover:opacity-90 transition-opacity"
        >
          ZicDeck
        </Link>
      </div>

      <div className="w-full max-w-md">
        <SignIn appearance={clerkAppearance} routing="path" path="/sign-in" />
      </div>
    </div>
  );
}
