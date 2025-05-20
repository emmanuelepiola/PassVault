'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Folder = {
  id: string;
  label: string;
  shared: boolean;
  editable: boolean;
  sharedWith: string[];
};

export type Item = {
  id: string;
  tag: string;
  website: string;
  username: string;
  password: string;
  securityLevel: 'low' | 'medium' | 'high';
  folderID: string;
};

type SelectionContextType = {
  selection: string;
  setSelection: (value: string) => void;
  ID: string;
  setID: (value: string) => void;
  folders: Folder[];
  setFolders: (value: Folder[]) => void;
  items: Item[];
  setItems: (value: Item[]) => void;
  getFolders: () => void;
  getItems: () => void;
  postFolder: (value: Folder) => void;
  postItem: (value: Item) => void;
  updateFolder: (value: Folder) => void;
  updateItem: (value: Item) => void;
  deleteFolder: (id: string) => void;
  deleteItem: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

const Account: string = "user@gmail.com"

const initialFolders = [
  { id: "1", label: "Intrattenimento", shared: false, editable: false, sharedWith: ["user1", "user2", "user3", "user4"] },
  { id: "2", label: "Lavoro", shared: true, editable: false, sharedWith: ["user1", "user2", "user3", "user4"] },
];

const initialItems: Item[] = [
  { id: "0", tag: "Amazon", website: "Amazon.com", securityLevel: "medium", folderID: "0", password: "password123", username: "username123" },
  { id: "1", tag: "Disney+", website: "Disney.com", securityLevel: "low", folderID: "1", password: "password123", username: "username123" },
  { id: "2", tag: "GitHub", website: "GitHub.com", securityLevel: "high", folderID: "2", password: "password123", username: "username123" },
  { id: "3", tag: "Netflix", website: "Netflix.com", securityLevel: "medium", folderID: "1", password: "password123", username: "username123" },
];


export const SelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string>();
  const [selection, setSelection] = useState("All Items");
  const [ID, setID] = useState("5");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [items, setItems] = useState<Item[]>([]); // get simulated items

  //=========== Funzioni per le richieste HTTP ============//

  // ===== GET automatico al mount =====
  useEffect(() => {
    getFolders();
    getItems();
  }, []);

  const getAccount = () => {
    // Simulazione GET
    setAccount(Account);
  };

  const getFolders = () => {
    // Simulazione GET
    setFolders(initialFolders);
  };

  const getItems = () => {
    // Simulazione GET
    setItems(initialItems);
  };
  
  const postFolder = (value: Folder) => {
    // post request per creare una nuova folder
    // comportamento simulato
    setFolders([...folders, value]);
  }

  const postItem = (value: Item) => {
    // post request per creare un nuovo item
    // comportamento simulato
    setItems([...items, value]);
    console.log(value);
  }

  const updateFolder = (value: Folder) => {
    // put request per aggiornare una folder
    // comportamento simulato
    setFolders(folders.map(folder => folder.id === value.id ? value : folder));
  }

  const updateItem = (value: Item) => {
    // put request per aggiornare un item
    // comportamento simulato
    setItems(items.map(item => item.id === value.id ? value : item));
  }

  const deleteFolder = (id: string) => {
    // delete request per eliminare una folder
    // comportamento simulato
    setFolders(folders.filter(folder => folder.id !== id));
  }

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  //=========== Fine funzioni per le richieste HTTP ============//

  return (
    <SelectionContext.Provider
      value={{selection,setSelection,ID,setID,folders,setFolders,items,setItems,getFolders,getItems,postFolder,postItem,updateFolder,updateItem,deleteFolder,deleteItem,searchTerm,setSearchTerm}}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) throw new Error("useSelection must be used within a SelectionProvider");
  return context;
};

