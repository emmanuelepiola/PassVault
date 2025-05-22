'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelection } from "../context";
import Label from "./components/Label"
import ItemBox from "./components/ItemBox";
import FieldsLabels from "./components/FieldsLabels"

export default function Dashboard() {
  const { selection } = useSelection();
  const router = useRouter();

  useEffect(() => {
    if (selection === "Password Generator") {
      router.push("/password-generator");
    } else if (selection === "Settings") {
      router.push("/settings");
    } else {
      router.push("/dashboard");
    }
  }, [selection, router]);

  return (
    <div className="h-full w-full flex flex-col">
      <Label label="Dashboard" />
      <FieldsLabels />
      <div className="flex-1 overflow-y-auto px-0 md:px-6">
        <ItemBox />
      </div>
    </div>
  );
}

