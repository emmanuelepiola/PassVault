'use client';

import { useState } from 'react';
import { useSelection, Folder } from '../context';
import ShareModal from './ShareModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ShareConfirmationModal from './ShareConfermationModal'; // ✅ importato

type Props = {
  id: string;
  label: string;
  icon: string;
  shared: boolean;
  sharedWith: string[];
  folderAccount: string;
  ownerEmail: string;
};

export default function FolderButton({
  id,
  label,
  icon,
  shared,
  sharedWith,
  ownerEmail
}: Props) {
  const {
    selection,
    setSelection,
    deleteFolder,
    updateFolder,
    account,
    removeSharedFolderForUser
  } = useSelection();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareConfirmOpen, setIsShareConfirmOpen] = useState(false); // ✅ nuovo stato

  const isSelected = selection === id;

  function handleClick() {
    setSelection(id);
    window.dispatchEvent(new Event('hide-sidebar'));
  }

  function handleDeleteIconClick(e: React.MouseEvent) {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  }

  function confirmDelete() {
    if (ownerEmail === account) {
      // Sei il proprietario: elimina la cartella dal database
      deleteFolder(id);
    } else {
      // NON sei il proprietario: elimina solo la condivisione per te
      removeSharedFolderForUser(id, account);
      
    }
    setIsDeleteModalOpen(false);
  }

  function cancelDelete() {
    setIsDeleteModalOpen(false);
  }

  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    setIsShareConfirmOpen(true); // ✅ apri conferma
  }

  function confirmShareToggle() {
    updateFolder(id, { shared: !shared }); // ✅ cambia stato
    setIsShareConfirmOpen(false);
  }

  function cancelShareToggle() {
    setIsShareConfirmOpen(false);
  }

  function handleShowSharedWith(e: React.MouseEvent) {
    e.stopPropagation();
    setIsShareModalOpen(true);
  }

  function setSharedWith(updated: string[]) {
    // Placeholder per update future
  }

  return (
    <>
      <div
        onClick={handleClick}
        className={`relative w-full flex items-center px-6 py-2 cursor-pointer transition-colors duration-200 ${
          isSelected ? 'bg-blue-200 text-white' : 'hover:bg-gray-100 text-gray-800'
        }`}
      >
        <span className="material-symbols-outlined text-lg flex-shrink-0">
          {icon}
        </span>

        <div className="pl-2 w-full pr-10 relative">
          <span
            className="block truncate overflow-hidden whitespace-nowrap w-full"
            title={label}
          >
            {label}
          </span>

          {/* Icona delete */}
          <div className="absolute right-[-0.5rem] top-0">
            <span
              className="material-symbols-outlined text-sm text-gray-400 hover:text-red-700 cursor-pointer"
              onClick={handleDeleteIconClick}
              title="Delete folder"
            >
              delete
            </span>
          </div>

          {/* Icone share & people */}
          <div className="absolute right-[1.2rem] top-0 flex items-center">
            {ownerEmail === account && (
              <span
                className="material-symbols-outlined text-sm text-gray-400 cursor-pointer hover:text-green-700"
                onClick={handleShare}
                title={shared ? 'Unshare folder' : 'Share folder'}
              >
                link
              </span>
            )}

            {shared && (
              <span
                className="material-symbols-outlined text-sm text-gray-400 cursor-pointer hover:text-blue-700 ml-2"
                onClick={handleShowSharedWith}
                title="View shared users"
              >
                people
              </span>
            )}

            {/* Share modal */}
            <ShareModal
              sharedWith={sharedWith}
              setSharedWith={setSharedWith}
              setShared={(state) => updateFolder(id, { shared: state })}
              isModalOpen={isShareModalOpen}
              setIsModalOpen={setIsShareModalOpen}
              label={label}
              shared={shared}
              folderAccount={id}
              ownerEmail={ownerEmail}
            />
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          folderName={label}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/* Share confirmation modal ✅ */}
      {isShareConfirmOpen && (
        <ShareConfirmationModal
          folderName={label}
          isShared={shared}
          onConfirm={confirmShareToggle}
          onCancel={cancelShareToggle}
        />
      )}
    </>
  );
}
