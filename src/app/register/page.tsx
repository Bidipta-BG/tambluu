import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "@/components/RegisterForm";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Registration Form — GetTambola",
  description: "Register to get your branded Tambola website.",
};

export default function RegisterPage() {
  return (
    <>
      <NavBar />

      <main className="flex-1 bg-dark-bg pt-0 pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <Suspense fallback={<div className="h-96" />}>
            <RegisterForm />
          </Suspense>
        </div>
      </main>
    </>
  );
}
