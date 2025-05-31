'use client';

import ReactDOM from 'react-dom';

{/* Modal for sharing a folder */}

type Props = {
  folderName: string;
  isShared: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ShareConfirmationModal({ folderName, isShared, onConfirm, onCancel }: Props) {
  const modalContent = (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">
          {isShared
            ? `Are you sure you want to unshare “${folderName}”?`
            : `Are you sure you want to share “${folderName}”?`}
        </h2>
        <p className="text-gray-600 mb-6">
          {isShared
            ? `Other users will no longer have access to this folder.`
            : `Sharing this folder will make it visible to selected users.`}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-blue-200 hover:bg-blue-300 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-blue-200 hover:bg-blue-300 text-gray-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined'
    ? ReactDOM.createPortal(modalContent, document.body)
    : null;
}
