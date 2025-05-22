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
  const { folders, setFolders , ID, setID, updateFolder, postFolder, account } = useSelection();
// ============================ ADD FOLDER ============================ //
  const addFolder = () => {
    setID((parseInt(ID) + 1).toString());
    const newFolder: Folder = {
      account: account,
      id: ID,
      label: label === "Shared" ? "Shared Folder" : "New Folder",
      icon: label === "Shared" ? "folder_shared" : "folder",
      editable: true,
      shared: label === "Shared",
      sharedWith: [],
    };
    postFolder(newFolder);
  };
// ============================ FINE ADD FOLDER ============================ //
// ============================ UPDATE FOLDER LABEL ============================ //
  const updateFolderLabel = (id: string, newLabel: string) => {
    folders.map(folder => {
      if (folder.id === id) {
        const updatedFolder: Folder = {account: account, id: id, label: newLabel, editable: false, shared: folder.shared, icon: folder.shared ? "folder_shared" : "folder", sharedWith: folder.sharedWith};
        updateFolder(updatedFolder);
      }
    });
  };
// ============================ FINE UPDATE FOLDER LABEL ============================ //
  const filteredFolders = folders.filter(folder =>
    label === "Shared" ? folder.shared : !folder.shared
  );

  return (
    <div className="w-full text-l md:pt-[1rem]">
      <SideBarFolderLabel label={label} addFolder={addFolder} />
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
        />
      ))}
    </div>
  );
}
