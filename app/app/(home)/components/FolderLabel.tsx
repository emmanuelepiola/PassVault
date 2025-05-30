'use client';

import { useState } from 'react';
import CreateFolderModal from './CreateFolderModal'; // Assicurati che il path sia corretto

type Props = {
  label: string;
  addFolder: (folderName: string) => void;
};

export default function FolderLabel({ label, addFolder }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full flex pl-[1rem] pr-[1rem] relative items-center">
        <label className="w-full text-xl border-b border-gray-500">
          {label} Folders
        </label>
        <button onClick={() => setIsModalOpen(true)}>
          <span
            className="material-symbols-outlined absolute right-4 bottom-0.5 cursor-pointer 
            text-gray-500 hover:text-black hover:scale-110 transition duration-200"
          >
            create_new_folder
          </span>
        </button>
      </div>

      {isModalOpen && (
        <CreateFolderModal
          onCreate={(name) => addFolder(name)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

