'use client';

import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';

type Props = {
  onCreate: (folderName: string) => void;
  onClose: () => void;
};

export default function CreateFolderModal({ onCreate, onClose }: Props) {
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = () => {
    if (folderName.trim()) {
      onCreate(folderName.trim());
      onClose();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Folder</h2>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-blue-200 hover:bg-blue-300 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-200 hover:bg-blue-300 text-gray-800"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined'
    ? ReactDOM.createPortal(modalContent, document.body)
    : null;
}
