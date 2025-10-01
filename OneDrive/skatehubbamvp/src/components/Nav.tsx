"use client";
import Link from "next/link";
import { useAuth } from "@/store/useAuth";
import Button from "./ui/Button";

export default function Nav() {
  const { user, signOut } = useAuth();
  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-black/70 backdrop-blur">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-9 h-9 bg-hubba-orange rounded-full flex items-center justify-center text-black font-bold">SH</div>
        <span className="font-black tracking-wide">SkateHubba</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/lobby" className="text-white hover:text-hubba-orange transition-colors">Lobby</Link>
        <Link href="/gallery" className="text-white hover:text-hubba-orange transition-colors">Gallery</Link>
        {user ? (
          <Button onClick={signOut} variant="ghost">Sign out</Button>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}