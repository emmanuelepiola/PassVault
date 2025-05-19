'use client'
import { useState, useRef, useEffect } from 'react';
import { useSelection } from '../context';

type Props = {
  id: string;
  label: string;
  icon: string;
  onLabelChange: (newLabel: string) => void;
  editable?: boolean;
};

export default function FolderButton({ id, label, icon, onLabelChange, editable = false }: Props) {
  const { selection, setSelection } = useSelection();
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
      inputRef.current?.select();
    }
  }, [isEditing]);

  return (
    <div
      onClick={handleClick}
      onDoubleClick={() => setIsEditing(true)}
      className={`w-full flex items-center px-6 py-2 cursor-pointer transition-colors duration-200 
        ${isSelected ? 'bg-blue-200 text-white' : 'hover:bg-gray-100 text-gray-800'}`}
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
      <div className="pl-2 w-full">
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
          <span>{label}</span>
        )}
      </div>
    </div>
  );
}

  