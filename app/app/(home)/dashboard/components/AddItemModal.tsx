'use client';
import { useEffect, useState, useRef } from 'react';
import { useSelection, Item } from "../../context";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
};

export default function AddItemModal({ isModalOpen, setIsModalOpen }: Props) {
  const { ID, selection, setID, postItem, account } = useSelection();

  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);

  const [tag, setTag] = useState('');
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      setShouldRender(true);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (shouldRender) {
      const enterTimeout = requestAnimationFrame(() => {
        setVisible(true);
      });
      return () => cancelAnimationFrame(enterTimeout);
    }
  }, [shouldRender]);

  useEffect(() => {
    if (!isModalOpen && shouldRender) {
      setVisible(false);
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isModalOpen]);

  function closeModal() {
    setIsModalOpen(false);
    setTag('');
    setWebsite('');
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setCopied(false);
  }

  const copyToClipboard = () => {
    if (passwordRef.current) {
      passwordRef.current.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newID = (parseInt(ID) + 1).toString();
    setID(newID);

    const folderID = (selection === "All Items" || selection === "Password Health") ? "0" : selection;
    const newItem: Item = {
      account: account,
      id: ID,
      tag: tag,
      website: website,
      username: username,
      password: password,
      securityLevel: "medium",
      folderID: folderID
    };

    postItem(newItem);
    closeModal();
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
      <div
        className={`bg-white rounded-lg shadow-lg relative p-6
          transform transition-all duration-300 ease-in-out
          ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          max-w-[600px] w-full max-h-[90vh] overflow-auto`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Password</h2>
          <span
            onClick={closeModal}
            className="material-symbols-outlined cursor-pointer text-gray-600 hover:text-gray-900 select-none"
            aria-label="Close modal"
          >
            close
          </span>
        </div>

        <form className="flex flex-col gap-4 min-w-[280px]" onSubmit={handleSubmit}>
          <label className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">label</span>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Tag"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded w-full focus:outline-none"
              required
            />
          </label>

          <label className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">language</span>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Website"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded w-full focus:outline-none"
              required
            />
          </label>

          <label className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">person</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded w-full focus:outline-none"
              required
            />
          </label>

          <label className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
            <input
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="pl-10 pr-20 py-2 border border-gray-300 rounded w-full focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <span className="material-symbols-outlined">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
            <button
              type="button"
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              aria-label="Copy password"
            >
              <span className="material-symbols-outlined">
                {copied ? 'done_all' : 'content_copy'}
              </span>
            </button>
          </label>

          <button
            type="submit"
            className="mt-4 bg-blue-100 text-black py-2 rounded hover:bg-blue-200 transition-colors font-semibold disabled:opacity-50"
            disabled={!tag || !website || !username || !password}
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}

