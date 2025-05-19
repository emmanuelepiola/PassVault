'use client';

import { createContext, useContext, useState } from 'react';

type SelectionContextType = {
  selection: string;
  setSelection: (value: string) => void;
  ID: string;
  setID: (value: string) => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selection, setSelection] = useState("All Items");
  const [ID, setID] = useState("1");

  return (
    <SelectionContext.Provider value={{ selection, setSelection, ID, setID}}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) throw new Error("useSelection must be used within a SelectionProvider");
  return context;
};

