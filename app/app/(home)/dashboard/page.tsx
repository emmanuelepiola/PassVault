'use client'

import { useSelection } from "../context";
import Label from "./components/Label";
import ItemBox from "./components/ItemBox";
import FieldsLabels from "./components/FieldsLabels";
import PasswordGeneratorBox from "./components/PasswordGeneratorBox";
import SettingsBox from "./components/SettingsBox";

export default function Dashboard() {
  const { selection } = useSelection();

  return (
    <div className="h-full w-full flex flex-col">
      <div className="border-b border-gray-200 md:border-0">
        <Label label={selection} />
      </div>

      {selection !== "Password Generator" && selection !== "Settings" && (
        <div className="hidden md:block">
          <FieldsLabels />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-0 md:px-6">
        {selection === "Password Generator" ? (
          <PasswordGeneratorBox />
        ) : selection === "Settings" ? (
          <SettingsBox />
        ) : (
          <ItemBox />
        )}
      </div>
    </div>
  );
}


