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
  ownerEmail: string;
};

type Props = {
  label: string;
};

export default function FolderSection({ label }: Props) {
  const { folders, ID, updateFolder, postFolder, account } = useSelection();

const handleAddFolder = async (folderName: string) => {
  const isShared = label === "Shared";

  await postFolder(folderName, isShared);
};
  const filteredFolders = folders.filter(folder => {
    const isShared = !!folder.shared; // Forza il valore booleano
    console.log(`Cartella: ${folder.label}, shared: ${isShared}`);
    return label === "Shared" ? isShared : !isShared;
  });


  return (
    <div className="w-full text-l pt-[1rem]">
      <SideBarFolderLabel label={label} addFolder={handleAddFolder} />
      {filteredFolders.map((folder, i) => (
        <FolderButton
          key={i}
          id={folder.id}
          label={folder.label}
          icon={folder.shared ? "folder_shared" : "folder"}
          shared={folder.shared}
          sharedWith={folder.sharedWith}
          folderAccount={folder.account}
          ownerEmail={folder.ownerEmail}
        />
      ))}
    </div>
  );
}
