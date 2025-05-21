'use client'

import { useSelection } from "../context";
import Label from "./components/Label";
import ItemBox from "./components/ItemBox";
import FieldsLabels from "./components/FieldsLabels";
import PasswordGeneratorBox from "./components/PasswordGeneratorBox";

export default function Dashboard() {
  const { selection } = useSelection();

  const title = selection === "Password Generator" ? "Password" : "Dashboard";

  return (
    <div className="h-full w-full flex flex-col">
      <Label label={title} />
      {selection === "Password Generator" ? (
          <></>
      ) : (
        <FieldsLabels />
      )}

      <div className="flex-1 overflow-y-auto px-0 md:px-6">
        {selection === "Password Generator" ? (
          <PasswordGeneratorBox />
        ) : (
          <ItemBox />
        )}
      </div>
    </div>
  );
}

