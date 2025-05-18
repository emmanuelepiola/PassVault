'use client'

import { useState } from "react";
import SideBarSearchBar from "./sidebarsearchbar";
import SideBarSection from "./sidebarsection"
import SideBarFolderSection from "./sidebarfoldersection"

type SelectedItem = {
  type: 'category' | 'tool' | 'folder';
  id: string | number;
} | null;

export default function Sidebar(){
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({ type: 'category', id: 'all-items' });

  const categoriesButtons = [
    { id: 'all-items', label: "All Items", icon: "apps" },
    { id: 'passwords', label: "Passwords", icon: "lock" },
    { id: 'credit-cards', label: "Credit Cards", icon: "credit_card" },
  ];

  const toolsButtons = [
    { id: 'password-generator', label: "Password Generator", icon: "lock_reset" },
    { id: 'password-health', label: "Password Health", icon: "ecg_heart" },
  ];

  const handleSelection = (type: 'category' | 'tool' | 'folder', id: string | number) => {
    setSelectedItem({ type, id });
  };

  return(
    <div className="bg-blue-100/80 backdrop-blur-sm fixed h-[100vh] w-[20rem] flex flex-col shadow-xl border-r border-blue-200/50">
      <div className="flex-none p-4 border-b border-blue-200/50">
        <SideBarSearchBar/>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SideBarSection 
          label="Categories" 
          buttons={categoriesButtons}
          selectedItem={selectedItem}
          onSelect={(id) => handleSelection('category', id)}
        />
        <SideBarFolderSection 
          selectedItem={selectedItem}
          onSelect={(id) => handleSelection('folder', id)}
        />
        <SideBarSection 
          label="Tools" 
          buttons={toolsButtons}
          selectedItem={selectedItem}
          onSelect={(id) => handleSelection('tool', id)}
        />
      </div>
    </div>
  );
}