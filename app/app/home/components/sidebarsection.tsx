'use client'

import { useState } from "react";
import SideBarButton from "./sidebarbutton";
import SideBarLabel from "./sidebarlabel";

type Button = {
  id: string;
  label: string;
  icon: string;
};

type Props = {
  label: string;
  buttons: Button[];
  selectedItem: { type: string; id: string | number } | null;
  onSelect: (id: string) => void;
};

export default function SideBarSection({ label, buttons, selectedItem, onSelect }: Props) {
  return (
    <div className="w-full text-l pt-[1rem]">
      <SideBarLabel label={label} />
      {buttons.map((btn) => (
        <SideBarButton
          key={btn.id}
          id={btn.id}
          label={btn.label}
          icon={btn.icon}
          isSelected={selectedItem?.id === btn.id}
          onClick={() => onSelect(btn.id)}
        />
      ))}
    </div>
  );
}
