'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../config/api';

export type Folder = {
  account: string;
  id: string;
  label: string;
  name?: string;
  shared: boolean;
  editable: boolean;
  sharedWith: string[];
  ownerEmail: string;
};

export type Item = {
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
  postFolder: (folderName: string, isShared: boolean) => void;
  postItem: (value: Item) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => Promise<void>;
  updateItem: (value: Item) => void;
  deleteFolder: (id: string) => void;
  deleteItem: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  account: string;
  setAccount: (value: string) => void;
  shareFolderWithUser: (email: string, folderId: string) => Promise<{ success: boolean; message: string }>;
  removeSharedFolderForUser: (folderId: string, userEmail: string) => Promise<void>;
  password: string; 
  setPassword: (value: string) => void;
  changePassword: (oldPass: string, newPass: string, repeatPass: string) => Promise<{ success: boolean; error?: string }>;
};

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selection, setSelection] = useState("All Items");
  const [ID, setID] = useState("0");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter();
  //=========== Funzioni per le richieste HTTP ============//

  // ===== GET automatico al mount =====
  useEffect(() => {
    getAccount();
    getFolders();
    getItems();
    console.log(account);
  }, []);


  const getAccount = async () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      // console.error('Utente non loggato!');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Account recuperato:', data);
        console.log('Password decriptata dal backend:', data.password);
        setAccount(data.email);
        setPassword(data.password); 
      } else {
        console.error('Errore nel recupero dell\'account:', response.statusText);
      }
    } catch (error) {
      console.error('Errore durante il recupero dell\'account:', error);
    }
  };

const getFolders = async () => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    // console.error('Utente non loggato!');
    router.push('/login');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/folders?user_id=${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Se necessario per autenticazione
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Cartelle recuperate dal backend:', data.folders);

      const mappedFolders = data.folders.map((folder: any) => ({
        id: folder.id,
        label: folder.name,
        account: folder.created_by,
        shared: folder.shared, // Forza il valore come booleano
        editable: folder.created_by === userId,
        sharedWith: folder.shared_with || [],
        ownerEmail: folder.owner_email
      }));

      setFolders(mappedFolders); //Setting delle cartelle in locale

    } else {
      console.error('Errore nel recupero delle cartelle:', response.statusText);
    }
  } catch (error) {
    console.error('Errore durante il recupero delle cartelle:', error);
  }
};

const getItems = async () => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    // console.error('Utente non loggato!');
    router.push('/login');
    return;
  }

  try {
    // Rimuovi il parametro folder_id dalla query string
    const response = await fetch(`${API_BASE_URL}/api/items?user_id=${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Se necessario per autenticazione
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Elementi recuperati (tutti):', data);

      // Mappa i dati recuperati e aggiorna lo stato
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
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    // console.error('Utente non loggato!');
    router.push('/login');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/addFolder`, {
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
          ownerEmail: account,
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
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    // console.error('Utente non loggato!');
    router.push('/login');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/addItem`, {
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

  // Conversione: se updates.label esiste, rinominalo in name
  const backendUpdates = { ...updates };
  if ('label' in backendUpdates) {
    backendUpdates.name = backendUpdates.label;
    delete backendUpdates.label;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/updateFolder/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(backendUpdates), // Passa i campi corretti al backend
    });

    if (response.ok) {
      console.log('Cartella aggiornata con successo');
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
    const response = await fetch(`${API_BASE_URL}/updateItem/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tag: item.tag,
        website: item.website,
        username: item.username,
        password: item.password,
        folder_id: item.folderID, 
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Elemento aggiornato:', data);

      setItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.id === item.id
            ? { ...prevItem, ...item, securityLevel: data.securityLevel }
            : prevItem
        )
      );
      getItems();
    } else {
      console.error('Errore durante l\'aggiornamento dell\'elemento:', data.error);
    }
  } catch (error) {
    console.error('Errore durante l\'aggiornamento dell\'elemento:', error);
  }
};

const deleteFolder = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/deleteFolder/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      console.log('Cartella eliminata con successo');
      setFolders((prevFolders) => prevFolders.filter(folder => folder.id !== id));
      setItems((prevItems) => prevItems.filter(item => item.folderID !== id)); // <-- aggiorna anche gli item!
      setSelection((prevSelection) => (prevSelection === id ? "All Items" : prevSelection)); // <-- aggiungi questa riga
    } else {
      const data = await response.json();
      console.error('Errore durante l\'eliminazione della cartella:', data.error);
    }
  } catch (error) {
    console.error('Errore durante l\'eliminazione della cartella:', error);
  }
};

const deleteItem = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/deleteItem/${id}`, {
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

const shareFolderWithUser = async (email: string, folderId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, folderId }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Cartella condivisa con successo:', data);
      return { success: true, message: data.message };
    } else {
      const error = await response.json();
      console.error('Errore durante la condivisione della cartella:', error.error);
      return { success: false, message: error.error };
    }
  } catch (error) {
    console.error('Errore durante la condivisione della cartella:', error);
    return { success: false, message: 'Errore di rete' };
  }
};
  
const removeSharedFolderForUser = async (folderId: string, userEmail: string) => {
  // Aggiorna la cartella localmente
  setFolders((prevFolders) =>
    prevFolders.map((folder) =>
      folder.id === folderId
        ? { ...folder, sharedWith: folder.sharedWith.filter(email => email !== userEmail) }
        : folder
    )
  );

  // Aggiorna anche sul backend
  try {
    const response = await fetch(`${API_BASE_URL}/api/folders/${folderId}/remove-shared-user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail }),
      credentials: 'include',
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('Errore durante la rimozione della condivisione:', data.error);
    }
  } catch (error) {
    console.error('Errore durante la rimozione della condivisione:', error);
  }
};

const changePassword = async (oldPass: string, newPass: string, repeatPass: string): Promise<{ success: boolean; error?: string }> => {
  if (newPass !== repeatPass) {
    return { success: false, error: "Le nuove password non coincidono." };
  }
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    return { success: false, error: "Utente non loggato." };
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
      credentials: "include",
    });
    if (response.ok) {
      setPassword(newPass);
      return { success: true };
    } else {
      const data = await response.json();
      return { success: false, error: data.error || "Errore durante l'aggiornamento della password." };
    }
  } catch {
    return { success: false, error: "Errore di rete." };
  }
};

  //=========== Fine funzioni per le richieste HTTP ============//

  return (
    <SelectionContext.Provider
      value={{selection,account,setAccount,setSelection,ID,setID,folders,setFolders,items,setItems,getFolders,getItems,postFolder,postItem,updateFolder,updateItem,deleteFolder,deleteItem,searchTerm,setSearchTerm, shareFolderWithUser, removeSharedFolderForUser, password, setPassword, changePassword}}
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
