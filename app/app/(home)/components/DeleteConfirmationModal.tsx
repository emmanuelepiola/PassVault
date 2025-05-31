'use client';

import ReactDOM from 'react-dom';

{/* Modal for deleting a folder */}

type Props = {
  folderName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmationModal({ folderName, onConfirm, onCancel }: Props) {
  const modalContent = (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">
          Are you sure you want to delete “{folderName}”?
        </h2>
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
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== 'undefined'
    ? ReactDOM.createPortal(modalContent, document.body)
    : null;
}
