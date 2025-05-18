'use client'

import { useState } from "react";
import SideBarFolderButton from "./sidebarfolderbutton";
import SideBarFolderLabel from "./sidebarfolderlabel";

type Folder = {
  id: number;
  label: string;
  icon: string;
};

type Props = {
  selectedItem: { type: string; id: string | number } | null;
  onSelect: (id: number) => void;
};

export default function SideBarFolderSection({ selectedItem, onSelect }: Props) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [nextId, setNextId] = useState(1);
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);

  const handleAddFolder = () => {
    const newFolder = {
      id: nextId,
      label: "",
      icon: "folder",
    };
    setFolders((prev) => [...prev, newFolder]);
    setEditingFolderId(nextId);
    setNextId((id) => id + 1);
  };

  const handleRenameFolder = (id: number, newLabel: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id ? { ...folder, label: newLabel } : folder
      )
    );
  };

  const handleFinishEditing = () => {
    setEditingFolderId(null);
  };

  return (
    <div className="w-full text-l pt-[1rem]">
      <SideBarFolderLabel onAddFolder={handleAddFolder} />
      {folders.map((folder) => (
        <SideBarFolderButton
          key={folder.id}
          id={folder.id}
          label={folder.label}
          icon={folder.icon}
          isSelected={selectedItem?.type === 'folder' && selectedItem?.id === folder.id}
          onRename={(newLabel) => handleRenameFolder(folder.id, newLabel)}
          startEditing={editingFolderId === folder.id}
          onFinishEditing={handleFinishEditing}
          onClick={() => onSelect(folder.id)}
        />
      ))}
    </div>
  );
}
