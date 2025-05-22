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
  shareFolder: (id: string) => void;
  unshareFolder: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  account: string;
  setAccount: (value: string) => void;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

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

  try {
    const response = await fetch(`http://localhost:8000/api/items?user_id=${userId}`, {
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
      folderID: item.folder_id || '0', // Se `folder_id` è nullo, assegna '0'
      account: item.user_id, // Supponendo che il backend restituisca `user_id`
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
        folder_id: item.folderID && item.folderID !== '0' ? item.folderID : null,
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

  const updateFolder = (value: Folder) => {
    // put request per aggiornare una folder
    // comportamento simulato
    setFolders(folders.map(folder => folder.id === value.id ? value : folder));
  }

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

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

const shareFolder = async (id: string) => {
  const folder = folders.find(folder => folder.id === id);
  if (!folder) return;

  try {
    const response = await fetch(`http://localhost:8000/updateFolder/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({
        shared: true, // Imposta il flag shared su true
      }),
    });

    if (response.ok) {
      console.log('Cartella condivisa con successo');

      // Aggiorna lo stato locale
      const updatedFolder = { ...folder, shared: true };
      updateFolder(updatedFolder);
    } else {
      console.error('Errore durante la condivisione della cartella');
    }
  } catch (error) {
    console.error('Errore durante la condivisione della cartella:', error);
  }
};

const unshareFolder = async (id: string) => {
  const folder = folders.find(folder => folder.id === id);
  if (!folder) return;

  try {
    const response = await fetch(`http://localhost:8000/updateFolder/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({
        shared: false, // Imposta il flag shared su false
      }),
    });

    if (response.ok) {
      console.log('Cartella non condivisa con successo');

      // Aggiorna lo stato locale
      const updatedFolder = { ...folder, shared: false };
      updateFolder(updatedFolder);
    } else {
      console.error('Errore durante la rimozione della condivisione della cartella');
    }
  } catch (error) {
    console.error('Errore durante la rimozione della condivisione della cartella:', error);
  }
};
  
  //=========== Fine funzioni per le richieste HTTP ============//

  return (
    <SelectionContext.Provider
      value={{selection,account,setAccount,setSelection,ID,setID,folders,setFolders,items,setItems,getFolders,getItems,postFolder,postItem,updateFolder,updateItem,deleteFolder,deleteItem,shareFolder,unshareFolder,searchTerm,setSearchTerm}}
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
