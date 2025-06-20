'use client'
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import { useSelection } from '../context';

{/* Modal for sharing a folder */}

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  label: string;
  shared: boolean;
  setShared: (value: boolean) => void;
  setSharedWith: (value: string[]) => void;
  sharedWith: string[]; 
  folderAccount: string;
  ownerEmail: string;
};

export default function ShareModal({
  isModalOpen,
  setIsModalOpen,
  label,
  shared,
  setShared,
  setSharedWith,
  sharedWith,
  folderAccount,
  ownerEmail
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [localSharedWith, setLocalSharedWith] = useState<string[]>([]);
  const { account, shareFolderWithUser } = useSelection();
  
  useEffect(() => {
    setMounted(true);
    setLocalSharedWith(sharedWith.filter(email => email && email !== account));
  }, [sharedWith, account]);

  if (!isModalOpen || !mounted) return null;

  // ============================ SHARE TOGGLE ============================ //
  function handleShareToggle() {
    if (shared && folderAccount !== account) {
      setShared(false);
      setSharedWith(localSharedWith.filter((u) => u.trim() !== ''));
    } else {
      setShared(true);
      setSharedWith(localSharedWith.filter((u) => u.trim() !== ''));
    }
    setIsModalOpen(false);
  }

  // ============================ HANDLE CHANGE ============================ //
  function handleInputChange(index: number, value: string) {
    const updated = [...localSharedWith];
    updated[index] = value;
    setLocalSharedWith(updated);
  }

  function handleBlur() {
    const cleaned = localSharedWith.filter((v) => v.trim() !== '' && v !== account);
    setSharedWith(cleaned);

    cleaned.forEach(async (email) => {
      const result = await shareFolderWithUser(email, String(folderAccount));
      if (!result.success) {
        alert(`Errore per ${email}: ${result.message}`);
      }
    });
  }

  const inputFields = [...localSharedWith];
  while (inputFields.length < 4) inputFields.push('');

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-[9999] transition-opacity duration-300"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg mx-4 flex flex-col gap-6 relative transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined select-none text-3xl">close</span>
        </button>

        <h1 className="text-2xl font-semibold text-gray-800">Shared with</h1>

        {inputFields.map((val, i) => (
          <input
            key={i}
            type="text"
            placeholder="email"
            value={val}
            onChange={(e) => handleInputChange(i, e.target.value)}
            onBlur={handleBlur}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400
                       focus:outline-none focus:ring-0 focus:border-gray-300 transition"
          />
        ))}

        {ownerEmail === account && (
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => {
                setIsModalOpen(false);
              }}
              className="bg-blue-100 hover:bg-blue-200 text-black font-semibold px-6 py-2 rounded-lg transition duration-300 ease-in-out"
            >
              Confirm
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-blue-100 hover:bg-blue-200 text-black font-semibold px-6 py-2 rounded-lg transition duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
