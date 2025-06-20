'use client'
import SearchBar from "./SearchBar";
import Section from "./Section"
import FolderSection from "./FolderSection"

{/* Sidebar component for the dashboard */}

export default function Sidebar() {
  const navigationButtons = [
    { label: "All Items", icon: "apps" },
    { label: "Password Health", icon: "ecg_heart" },
    { label: "Password Generator", icon: "lock_reset" },
    { label: "Settings", icon: "settings" },
  ];

  return (
    <div className="bg-blue-100 backdrop-blur-sm h-[100vh] w-full md:w-[25rem] flex flex-col shadow-xl border-r border-blue-200/50">
      <div className="hidden md:block flex-none p-4 border-b border-blue-200/50">
        <SearchBar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Section label="Vault Navigation" buttons={navigationButtons} />
        <FolderSection label="" />
        <FolderSection label="Shared" />
      </div>
    </div>
  );
}