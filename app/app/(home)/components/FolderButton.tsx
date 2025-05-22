'use client'

import { useState, useRef, useEffect } from 'react';
import { useSelection, Folder } from '../context';
import ShareModal from './ShareModal';

type Props = {
  id: string;
  label: string;
  icon: string;
  shared: boolean;
  sharedWith: string[];
  onLabelChange: (newLabel: string) => void;
  editable: boolean;
  folderAccount: string;
};

export default function FolderButton({
  id,
  label,
  icon,
  onLabelChange,
  editable,
  shared,
  sharedWith,
  folderAccount
}: Props) {
  const {
    selection,
    setSelection,
    deleteFolder,
    updateFolder,
    account,
    shareFolder,
    unshareFolder
  } = useSelection();

  const [isEditing, setIsEditing] = useState(editable);
  const [tempLabel, setTempLabel] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isSelected = selection === id;

  function handleClick() {
    if (!isEditing) {
      setSelection(id);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      finalizeEdit();
    }
  }

  function finalizeEdit() {
    setIsEditing(false);
    if (tempLabel.trim() && tempLabel !== label) {
      onLabelChange(tempLabel);
    }
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    deleteFolder(id);
  }

  // ============================ SHARE ============================ //

  /** Toggle shared/unshared senza aprire il modal */
  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    setShared(!shared);
  }

  /** Esegue realmente share o unshare */
  function setShared(bool: boolean) {
    if (bool) {
      shareFolder(id);
    } else {
      unshareFolder(id);
    }
  }

  /** Mostra il modal con la lista sharedWith */
  function handleShowSharedWith(e: React.MouseEvent) {
    e.stopPropagation();
    setIsModalOpen(true);
  }

  /** Aggiorna la lista sharedWith e salva sul DB */
  function setSharedWith(sharedWithMod: string[]) {
    if (sharedWithMod !== sharedWith) {
      const folder: Folder = {
        account,
        id,
        label,
        shared,
        editable,
        sharedWith: sharedWithMod
      };
      updateFolder(folder);
    }
  }

  // ============================ FINE SHARE ============================ //

  return (
    <div
      onClick={handleClick}
      onDoubleClick={() => setIsEditing(true)}
      className={`relative w-full flex items-center px-6 py-2 cursor-pointer transition-colors duration-200 ${
        isSelected ? 'bg-blue-200 text-white' : 'hover:bg-gray-100 text-gray-800'
      }`}
    >
      <span className="material-symbols-outlined text-lg flex-shrink-0">
        {icon}
      </span>
      <div className="pl-2 w-full pr-10 relative">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={tempLabel}
            onChange={(e) => setTempLabel(e.target.value)}
            onBlur={finalizeEdit}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-b border-gray-400 focus:outline-none w-full"
          />
        ) : (
          <span
            className="block truncate overflow-hidden whitespace-nowrap w-full"
            title={label}
          >
            {label}
          </span>
        )}

        <div className="absolute right-[-0.5rem] top-0">
          <span
            className="material-symbols-outlined text-sm text-gray-400 hover:text-red-700 cursor-pointer"
            onClick={handleDelete}
            title="Elimina cartella"
          >
            delete
          </span>
        </div>

        <div className="absolute right-[1.2rem] top-0 flex items-center">
          {/* Icona link per share/unshare */}
          <span
            className="material-symbols-outlined text-sm text-gray-400 cursor-pointer hover:text-green-700"
            onClick={handleShare}
            title={shared ? 'Rimuovi condivisione' : 'Condividi cartella'}
          >
            link
          </span>

          {/* Icona people per aprire il modal, mostrata solo se shared */}
          {shared && (
            <span
              className="material-symbols-outlined text-sm text-gray-400 cursor-pointer hover:text-blue-700 ml-2"
              onClick={handleShowSharedWith}
              title="Visualizza utenti condivisi"
            >
              people
            </span>
          )}

          {/* Modal per gestire sharedWith */}
          <ShareModal
            sharedWith={sharedWith}
            setSharedWith={setSharedWith}
            setShared={setShared}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            label={label}
            shared={shared}
            folderAccount={folderAccount}
          />
        </div>
      </div>
    </div>
  );
}