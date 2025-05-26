'use client';

import { useState, useEffect, useRef } from 'react';
import AddButton from './AddButton';
import SearchBar from '../../components/SearchBar';
import { useSelection, Folder } from '../../context';

type Props = {
  label: string;
};

export default function Label({ label }: Props) {
  const { folders ,account , updateFolder } = useSelection();

  const isSystemLabel =
    label === 'Password Generator' ||
    label === 'All Items' ||
    label === 'Password Health' ||
    label === 'Settings';

  const folder = folders.find((f: Folder) => f.id === label);
  const displayLabel = isSystemLabel ? label : folder?.label || label;

  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(displayLabel);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedLabel(displayLabel);
  }, [displayLabel]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

//==============================================UPDATE LABEL==============================================
  const handleLabelChange = (newLabel: string) => {
    if (!folder) return;
    updateFolder(folder.id, { label : newLabel });
  };
//==============================================ENDUPDATE LABEL==============================================

  const handleSubmit = () => {
    if (editedLabel.trim() && editedLabel !== displayLabel) {
      handleLabelChange(editedLabel.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditedLabel(displayLabel);
      setIsEditing(false);
    }
  };

  return (
    <div className="mr-[2rem] ml-4 md:ml-[2rem] md:pt-[1.8rem] md:pb-[2rem] relative">
      {label !== "Password Generator" && label !== "Settings" && <AddButton />}

      <div className="block md:hidden">
        <SearchBar />
      </div>

      {/* Desktop Label */}
      <div className="hidden md:flex items-center space-x-2 text-4xl">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editedLabel}
            onChange={(e) => setEditedLabel(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            className="text-4xl border-b border-gray-400 focus:outline-none px-1"
          />
        ) : (
          <>
            <label className="pb-0">{displayLabel}</label>
            {!isSystemLabel && (
              <span
                className="material-symbols-outlined pt-2 text-xl text-gray-500 hover:text-black cursor-pointer"
                title="Edit label"
                onClick={() => setIsEditing(true)}
              >
                edit
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
