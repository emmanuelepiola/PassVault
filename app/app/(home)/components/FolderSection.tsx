'use client'

import { useState } from "react";
import { useSelection } from "../context";
import SideBarFolderLabel from "./FolderLabel";
import FolderButton from "./FolderButton";

type Folder = {
  id: string;
  label: string;
  icon: string;
  editable: boolean;
};

type Props = {
  label: string;
};

export default function FolderSection({ label }: Props) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const { ID, setID } = useSelection();

  const addFolder = () => {
    setID((parseInt(ID) + 1).toString())
    const newFolder: Folder = {
      id: ID,
      label: "New Folder",
      icon: "folder",
      editable: true, // sarà subito modificabile
    };
    setFolders([...folders, newFolder]);
  };

  const updateFolderLabel = (index: number, newLabel: string) => {
    const updatedFolders = [...folders];
    updatedFolders[index].label = newLabel;
    updatedFolders[index].editable = false;
    setFolders(updatedFolders);
  };

  return (
    <div className="w-full text-l pt-[1rem]">
      <SideBarFolderLabel label={label} addFolder={addFolder} />
      {folders.map((folder, i) => (
        <FolderButton
          key={i}
          id={folder.id}
          label={folder.label}
          icon={folder.icon}
          editable={folder.editable}
          onLabelChange={(newLabel) => updateFolderLabel(i, newLabel)}
        />
      ))}
    </div>
  );
}
