'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelection } from "../../context";

export default function Dashboard() {
  const { selection } = useSelection();
  const router = useRouter();

  useEffect(() => {
    if (selection === "Password Generator") {
      router.push("/password-generator");
    }
    else if (selection === "Settings") {
      router.push("/settings");
    }
    else {
      router.push("/dashboard");
    }
  }, [selection, router]);

  return (
    <div className="h-full w-full">
    </div>
  );
}