"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";

export default function Protected({ children }: { children: ReactNode }) {
  const { user, verified, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;
    if (!user) router.replace("/login");
    else if (!verified) router.replace("/verify");
  }, [user, verified, initializing, router]);

  if (!user || !verified) return null;
  return <>{children}</>;
}