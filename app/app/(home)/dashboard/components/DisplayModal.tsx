'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelection, Item } from '../../context';

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  id: string;
  tag: string;
  website: string;
  username: string;
  password: string;
  securityLevel: string;
};

export default function DisplayModal({
  isModalOpen,
  setIsModalOpen,
  id,
  tag: initialTag,
  website: initialWebsite,
  username: initialUsername,
  password: initialPassword,
  securityLevel: initialSecurityLevel,
}: Props) {
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [tag, setTag] = useState(initialTag);
  const [website, setWebsite] = useState(initialWebsite);
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);
  const [securityLevel, setSecurityLevel] = useState<string>(initialSecurityLevel);

  const modalRef = useRef<HTMLDivElement>(null);
  const hasShownAlertRef = useRef(false);
  const tagRef = useRef<HTMLInputElement>(null);

  const { updateItem, account } = useSelection();

  useEffect(() => {
    if (isModalOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const timeout = setTimeout(() => {
        setShouldRender(false);
        setIsEditing(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        checkIfAnyFieldChanged();
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [tag, website, username, password]);

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      checkIfAnyFieldChanged();
      setIsEditing(false);
      e.currentTarget.blur();
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTag(initialTag);
    setWebsite(initialWebsite);
    setUsername(initialUsername);
    setPassword(initialPassword);
    setCopiedField(null);
    setIsEditing(false);
    hasShownAlertRef.current = false;
  };

  const checkIfAnyFieldChanged = () => {
    if (
      !hasShownAlertRef.current &&
      (tag !== initialTag || website !== initialWebsite || username !== initialUsername || password !== initialPassword)
    ) {
      const item: Item = {
        account: account,
        id: id,
        tag,
        website,
        username,
        password,
        securityLevel,
        folderID: '0',
      };
      updateItem(item);
      console.log('Modifiche salvate!');
      hasShownAlertRef.current = true;
    }
  };

  const toggleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
      setTimeout(() => {
        tagRef.current?.focus();
        tagRef.current?.select();
      }, 0);
    } else {
      checkIfAnyFieldChanged();
      setIsEditing(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-lg relative p-6 transform transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} max-w-[600px] w-full max-h-[90vh] overflow-auto`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-black">
            {isEditing ? 'Modifica' : 'Password'}
          </h2>
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();
            }}
            className="material-symbols-outlined cursor-pointer text-gray-600 hover:text-gray-900 select-none"
          >
            close
          </span>
        </div>

        <form className="flex flex-col gap-4 min-w-[280px]" onSubmit={(e) => e.preventDefault()}>
          {/* Tag */}
          <label className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">label</span>
            <input
              ref={tagRef}
              type="text"
              value={tag}
              readOnly={!isEditing}
              onChange={(e) => setTag(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => checkIfAnyFieldChanged()}
              className="pl-10 pr-10 py-2 border border-gray-300 rounded w-full focus:outline-none"
              placeholder="Tag"
            />
            <span
              onClick={() => copyToClipboard(tag, 'tag')}
              className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-700 select-none transition-colors"
            >
              {copiedField === 'tag' ? 'check' : 'content_copy'}
            </span>
          </label>

          {/* Website */}
          <label className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">language</span>
            <input
              type="text"
              value={website}
              readOnly={!isEditing}
              onChange={(e) => setWebsite(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => checkIfAnyFieldChanged()}
              className="pl-10 pr-10 py-2 border border-gray-300 rounded w-full focus:outline-none"
              placeholder="Website"
            />
            <span
              onClick={() => copyToClipboard(website, 'website')}
              className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-700 select-none transition-colors"
            >
              {copiedField === 'website' ? 'check' : 'content_copy'}
            </span>
          </label>

          {/* Username */}
          <label className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">person</span>
            <input
              type="text"
              value={username}
              readOnly={!isEditing}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => checkIfAnyFieldChanged()}
              className="pl-10 pr-10 py-2 border border-gray-300 rounded w-full focus:outline-none"
              placeholder="Username"
            />
            <span
              onClick={() => copyToClipboard(username, 'username')}
              className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-700 select-none transition-colors"
            >
              {copiedField === 'username' ? 'check' : 'content_copy'}
            </span>
          </label>

          {/* Password */}
          <label className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
            <input
              type="text"
              value={password}
              readOnly={!isEditing}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => checkIfAnyFieldChanged()}
              className="pl-10 pr-10 py-2 border border-gray-300 rounded w-full focus:outline-none"
              placeholder="Password"
            />
            <span
              onClick={() => copyToClipboard(password, 'password')}
              className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-700 select-none transition-colors"
            >
              {copiedField === 'password' ? 'check' : 'content_copy'}
            </span>
          </label>

          {/* Bottone Edit/Salva */}
          <button
            type="button"
            className="mt-6 bg-blue-100 hover:bg-blue-200 text-gray-700 font-semibold py-2 px-4 rounded transition-colors"
            onClick={toggleEdit}
          >
            {isEditing ? 'Salva modifiche' : 'Modifica'}
          </button>
        </form>
      </div>
    </div>
  );
}
