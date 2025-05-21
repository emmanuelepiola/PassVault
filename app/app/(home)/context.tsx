'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Folder = {
  account: string;
  id: string;
  label: string;
  shared: boolean;
  editable: boolean;
  sharedWith: string[];
};

export type Item = {
  account: string;
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
  postFolder: (folderName: string) => void;
  postItem: (value: Item) => void;
  updateFolder: (value: Folder) => void;
  updateItem: (value: Item) => void;
  deleteFolder: (id: string) => void;
  deleteItem: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  account: string;
  setAccount: (value: string) => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

const initialFolders = [
  { account: "user@gmail.com", id: "1", label: "Intrattenimento", shared: false, editable: false, sharedWith: ["user1", "user2", "user3", "user4"] },
  { account: "user@gmail.com", id: "2", label: "Lavoro", shared: true, editable: false, sharedWith: ["user1", "user2", "user3", "user4"] },
];

const initialItems: Item[] = [
  { account: "user@gmail.com", id: "0", tag: "Amazon", website: "Amazon.com", securityLevel: "medium", folderID: "0", password: "password123", username: "username123" },
  { account: "user@gmail.com", id: "1", tag: "Disney+", website: "Disney.com", securityLevel: "low", folderID: "1", password: "password123", username: "username123" },
  { account: "user@gmail.com", id: "2", tag: "GitHub", website: "GitHub.com", securityLevel: "high", folderID: "2", password: "password123", username: "username123" },
  { account: "user@gmail.com", id: "3", tag: "Netflix", website: "Netflix.com", securityLevel: "medium", folderID: "1", password: "password123", username: "username123" },
];


export const SelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string>("user@gmail.com");
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
    getAccount();
    console.log(account);
  }, []);

  const getAccount = () => {
    // Simulazione GET
    setAccount(account);
    
  };

  const getFolders = () => {
    // Simulazione GET
    setFolders(initialFolders);
  };

  const getItems = () => {
    // Simulazione GET
    setItems(initialItems);
  };
  
  const postFolder = async (folderName: string) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('Utente non loggato!');
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/addFolder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: folderName,
        user_id: userId,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Cartella aggiunta:', data);

      setFolders((prevFolders) => [
        ...prevFolders,
        {
          id: data.folder_id,
          label: folderName,
          account: account,
          shared: false,
          editable: true,
          sharedWith: [],
        },
      ]);
    } else {
      console.error('Errore dal server:', data.error);
    }
  } catch (error) {
    console.error('Errore durante la creazione della cartella:', error);
  }
};

const postItem = async (item: Item) => {
  const userId = localStorage.getItem('userId'); // Recupera l'user_id salvato
  if (!userId) {
    console.error('Utente non loggato!');
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/addItem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        tag: item.tag,
        username: item.username,
        password: item.password,
        website: item.website,
        folder_id: item.folderID && item.folderID !== '0' ? item.folderID : null, // Invia NULL se folderID non è valido
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Item aggiunto:', data);
      setItems((prevItems) => [...prevItems, item]); // Aggiorna lo stato locale
    } else {
      console.error('Errore dal server:', data.error);
    }
  } catch (error) {
    console.error('Errore durante l\'aggiunta dell\'elemento:', error);
  }
};

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
      value={{selection,account,setAccount,setSelection,ID,setID,folders,setFolders,items,setItems,getFolders,getItems,postFolder,postItem,updateFolder,updateItem,deleteFolder,deleteItem,searchTerm,setSearchTerm}}
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

