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

type Item = {
  account: string;
  id: string;
  tag: string;
  website: string;
  username: string;
  password: string;
  securityLevel: "low" | "medium" | "high" | "unknown"; 
  folderID: string,
  sharedFolder: boolean;
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
  updateFolder: (id: string, updates: Partial<Folder>) => Promise<void>;
  updateItem: (value: Item) => void;
  deleteFolder: (id: string) => void;
  deleteItem: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  account: string;
  setAccount: (value: string) => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string>("");
  const [selection, setSelection] = useState("All Items");
  const [ID, setID] = useState("0");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);

  //=========== Funzioni per le richieste HTTP ============//

  // ===== GET automatico al mount =====
  useEffect(() => {
    getFolders();
    getItems();
    getAccount();
    console.log(account);
  }, []);


  const getAccount = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('Utente non loggato!');
    return;
  }

  try {
    const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Se necessario per autenticazione
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Account recuperato:', data);
      setAccount(data.email); // Supponendo che il backend restituisca un oggetto con una proprietà `email`
    } else {
      console.error('Errore nel recupero dell\'account:', response.statusText);
    }
  } catch (error) {
    console.error('Errore durante il recupero dell\'account:', error);
  }
};

const getFolders = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('Utente non loggato!');
    return;
  }

  try {
    const response = await fetch(`http://localhost:8000/api/folders?user_id=${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Se necessario per autenticazione
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Cartelle recuperate:', data);
      setFolders(
        data.folders.map((folder: any) => ({
          id: folder.id,
          label: folder.name,
          account: folder.created_by, // Supponendo che il backend restituisca `created_by`
          shared: folder.shared === 1, // Converti il valore numerico in booleano
          editable: folder.created_by === userId, // L'utente può modificare solo le proprie cartelle
          sharedWith: folder.shared_with || [], // Supponendo che il backend restituisca un array `shared_with`
        }))
      );
    } else {
      console.error('Errore nel recupero delle cartelle:', response.statusText);
    }
  } catch (error) {
    console.error('Errore durante il recupero delle cartelle:', error);
  }
};

const getItems = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('Utente non loggato!');
    return;
  }

  const folderParam = ID && ID !== '0' ? `&folder_id=${ID}` : '';

  try {
    const response = await fetch(`http://localhost:8000/api/items?user_id=${userId}${folderParam}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Se necessario per autenticazione
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Elementi recuperati:', data);
      setItems(
      data.items.map((item: any) => ({
      id: item.id,
      tag: item.tag,
      website: item.website,
      username: item.username,
      password: item.password,
      securityLevel: item.securityLevel || 'unknown', // Usa direttamente il valore restituito dal backend
      folderID: item.folderId || '0', // Se `folder_id` è nullo, assegna '0'
      account: item.user_id, // Supponendo che il backend restituisca `user_id`
      sharedFolder: item.shared || false, // Mappa il campo `sharedFolder` dal backend
  }))
);
    } else {
      console.error('Errore nel recupero degli elementi:', response.statusText);
    }
  } catch (error) {
    console.error('Errore durante il recupero degli elementi:', error);
  }
};
  
const postFolder = async (folderName: string, isShared: boolean = false) => {
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
        shared: isShared, // Passa il valore booleano al backend
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
          shared: isShared, // Imposta il flag shared
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
  const userId = localStorage.getItem('userId');
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
        password: item.password, // Invia la password in chiaro
        website: item.website,
        folder_id: item.folderID
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Item aggiunto:', data);

      // Aggiorna lo stato locale con il livello di sicurezza restituito dal backend
      getItems();
    } else {
      console.error('Errore dal server:', data.error);
    }
  } catch (error) {
    console.error("Errore durante l'aggiunta dell'elemento:", error);
  }

};

const updateFolder = async (id: string, updates: Partial<Folder>) => {
  const folder = folders.find(folder => folder.id === id);
  if (!folder) return;

  try {
    const response = await fetch(`http://localhost:8000/updateFolder/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(updates), // Passa solo i campi da aggiornare
    });

    if (response.ok) {
      console.log('Cartella aggiornata con successo');

      // Aggiorna lo stato locale
      const updatedFolder = { ...folder, ...updates };
      setFolders(folders.map(f => (f.id === id ? updatedFolder : f)));
    } else {
      console.error('Errore durante l\'aggiornamento della cartella');
    }
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della cartella:', error);
  }
};

const updateItem = async (item: Item) => {
  try {
    const response = await fetch(`http://localhost:8000/updateItem/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tag: item.tag,
        website: item.website,
        username: item.username,
        password: item.password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Elemento aggiornato:', data);

      // Aggiorna lo stato locale con il livello di sicurezza restituito dal backend
      setItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.id === item.id
            ? { ...prevItem, ...item, securityLevel: data.securityLevel }
            : prevItem
        )
      );
      getItems()
    } else {
      console.error('Errore durante l\'aggiornamento dell\'elemento:', data.error);
    }
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'elemento:', error);
  }
};

  const deleteFolder = (id: string) => {
    // delete request per eliminare una folder
    // comportamento simulato
    setFolders(folders.filter(folder => folder.id !== id));
  }

const deleteItem = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:8000/deleteItem/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      console.log('Elemento eliminato con successo');
      
      // Aggiorna lo stato locale rimuovendo l'elemento eliminato
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } else {
      const data = await response.json();
      console.error('Errore durante l\'eliminazione dell\'elemento:', data.error);
    }
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'elemento:', error);
  }
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
