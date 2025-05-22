'use client'

import { useState } from "react";
import { useSelection } from "../context";
import SideBarFolderLabel from "./FolderLabel";
import FolderButton from "./FolderButton";

type Folder = {
  account: string;
  id: string;
  label: string;
  icon: string;
  editable: boolean;
  shared: boolean;
  sharedWith: string[];
};

type Props = {
  label: string;
};

export default function FolderSection({ label }: Props) {
  const { folders, setFolders, ID, setID, updateFolder, postFolder, account, shareFolder } = useSelection();

const handleAddFolder = async (folderName: string) => {
  // Determina se la cartella deve essere condivisa
  const isShared = label === "Shared";

  // Crea la cartella con il flag shared corretto
  await postFolder(folderName, isShared);
};

  const updateFolderLabel = async (id: string, newLabel: string) => {
    try {
      const response = await fetch(`http://localhost:8000/updateFolder/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLabel,
        }),
      });

      if (response.ok) {
        console.log('Nome della cartella aggiornato con successo');
        setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === id ? { ...folder, label: newLabel } : folder
          )
        );
      } else {
        console.error('Errore durante l\'aggiornamento del nome della cartella');
      }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento del nome della cartella:', error);
    }
  };

  const filteredFolders = folders.filter(folder =>
    label === "Shared" ? folder.shared : !folder.shared
  );

  return (
    <div className="w-full text-l pt-[1rem]">
      <SideBarFolderLabel label={label} addFolder={handleAddFolder} />
      {filteredFolders.map((folder, i) => (
        <FolderButton
          folderAccount={account}
          key={i}
          id={folder.id}
          label={folder.label}
          icon={folder.shared ? "folder_shared" : "folder"}
          shared={folder.shared}
          sharedWith={folder.sharedWith}
          editable={folder.editable}
          onLabelChange={(newLabel) => updateFolderLabel(folder.id, newLabel)}
          folderAccount={folder.account}
        />
      ))}
    </div>
  );
}
