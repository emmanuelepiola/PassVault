'use client'

import "./globals.css";
import Sidebar from "./components/Sidebar";
import { SelectionProvider } from './context';
import { useState, useEffect } from "react";

{/* Layout for the dashboard */}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<"sidebar" | "content">("content");

  useEffect(() => {
    const showSidebar = () => setActiveView("sidebar");
    const hideSidebar = () => setActiveView("content");

    window.addEventListener("show-sidebar", showSidebar);
    window.addEventListener("hide-sidebar", hideSidebar);

    return () => {
      window.removeEventListener("show-sidebar", showSidebar);
      window.removeEventListener("hide-sidebar", hideSidebar);
    };
  }, []);

  return (
    <div className="h-[100dvh] w-[100dvw] overflow-hidden bg-white">
      <SelectionProvider>
        <div className="hidden md:flex h-full w-full flex-row">
          <Sidebar />
          <div className="h-full w-full">{children}</div>
        </div>

        <div className="relative md:hidden h-full w-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full w-full transition-transform duration-300 ease-in-out`}
            style={{
              transform:
                activeView === "sidebar" ? "translateX(0%)" : "translateX(-100%)",
            }}
          >
            <Sidebar />
          </div>

          <div
            className={`absolute top-0 left-0 h-full w-full transition-transform duration-300 ease-in-out`}
            style={{
              transform:
                activeView === "content" ? "translateX(0%)" : "translateX(100%)",
            }}
          >
            {children}
          </div>
        </div>
      </SelectionProvider>
    </div>
  );
}

