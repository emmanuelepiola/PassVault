'use client'

import "./globals.css";
import Sidebar from "./components/Sidebar"
import { SelectionProvider, useSelection } from './context';
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState("All Items");
  

  return(
      <div className="h-[100vh] w-[100vw] overflow-hidden flex flex-row bg-white">
        <SelectionProvider>
          <Sidebar/>
          <div className="h-full w-full pl-[20rem]" >
            {children}
          </div>
        </SelectionProvider>
      </div>
  );
}
