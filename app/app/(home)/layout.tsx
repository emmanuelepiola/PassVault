'use client'

import "./globals.css";
import Sidebar from "./components/Sidebar";
import { SelectionProvider } from '../context';
import { useState, useRef } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<"sidebar" | "content">("content");

  const touchStartX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    if (deltaX > 50) {
      setActiveView("sidebar");
    } else if (deltaX < -50) {
      setActiveView("content");
    }

    touchStartX.current = null;
  };

  // Mouse handlers (for desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const deltaX = e.clientX - mouseStartX.current;

    if (deltaX > 50) {
      setActiveView("sidebar");
    } else if (deltaX < -50) {
      setActiveView("content");
    }

    mouseStartX.current = null;
  };

  return (
    <html>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body
        className="h-[100dvh] w-[100dvw] overflow-hidden bg-white"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <SelectionProvider>
          {/* Desktop layout */}
          <div className="hidden md:flex h-full w-full flex-row">
            <Sidebar />
            <div className="h-full w-full">{children}</div>
          </div>

          {/* Mobile layout */}
          <div className="relative md:hidden h-full w-full overflow-hidden">
            {/* Sidebar */}
            <div
              className={`absolute top-0 left-0 h-full w-full transition-transform duration-300 ease-in-out`}
              style={{
                transform:
                  activeView === "sidebar" ? "translateX(0%)" : "translateX(-100%)",
              }}
            >
              <Sidebar />
            </div>

            {/* Content */}
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
      </body>
    </html>
  );
}
