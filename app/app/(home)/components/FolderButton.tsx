'use client'
import { useState, useRef, useEffect } from 'react';
import { useSelection , Folder} from '../context';

type Props = {
  id: string;
  label: string;
  icon: string;
  shared: boolean;
  onLabelChange: (newLabel: string) => void;
  editable?: boolean;
};

export default function FolderButton({ id, label, icon, onLabelChange, editable, shared }: Props) {
  const { selection, setSelection, deleteFolder, updateFolder } = useSelection();
  const [isEditing, setIsEditing] = useState(editable);
  const [tempLabel, setTempLabel] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

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
    console.log('delete folder', id);
    deleteFolder(id);

  }
// ============================ SHARE/UNSHARE ============================ //
  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    if (!shared) {
      const updatedFolder: Folder = {id: id,label: label, shared: true, editable: false};
      updateFolder(updatedFolder);
    }
    else {
      const updatedFolder: Folder = {id: id,label: label, shared: false, editable: false};
      updateFolder(updatedFolder);
    }
  }
// ============================ FINE SHARE ============================ //
  return (
    <div
      onClick={handleClick}
      onDoubleClick={() => setIsEditing(true)}
      className={`relative w-full flex items-center px-6 py-2 cursor-pointer transition-colors duration-200 
        ${isSelected ? 'bg-blue-200 text-white' : 'hover:bg-gray-100 text-gray-800'}`}
    >
      <span className="material-symbols-outlined text-lg flex-shrink-0">{icon}</span>
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
          >
            delete
          </span>
        </div>

        <div className="absolute right-[1.2rem] top-0">
          <span
            className={`material-symbols-outlined text-sm text-gray-400 cursor-pointer hover:${shared ? 'text-red-700' : 'text-green-700'}`}
            onClick={handleShare}
          >
            link
          </span>
        </div>
      </div>
    </div>
  );
}


  