'use client'

import { useEffect, useRef, useState } from "react";

type Props = {
  id: number;
  label: string;
  icon: string;
  isSelected: boolean;
  onRename: (newLabel: string) => void;
  startEditing?: boolean;
  onFinishEditing: () => void;
  onClick: () => void;
};

export default function SideBarFolderButton({
  id,
  label,
  icon,
  isSelected,
  onRename,
  startEditing = false,
  onFinishEditing,
  onClick,
}: Props) {
  const [isEditing, setIsEditing] = useState(startEditing);
  const [tempLabel, setTempLabel] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (startEditing) {
      setIsEditing(true);
    }
  }, [startEditing]);

  const handleBlur = () => {
    const finalLabel = tempLabel.trim() === "" ? "New Folder" : tempLabel.trim();
    onRename(finalLabel);
    setIsEditing(false);
    setTempLabel(finalLabel);
    onFinishEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setTempLabel(label);
      onFinishEditing();
    }
  };

  return (
    <div 
      className={`w-full flex flex-row items-center pt-[0.5rem] pb-[0.5rem] pl-[1.5rem] pr-[1.5rem] cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-blue-200/80 text-blue-900 font-medium' 
          : 'text-blue-800/80 hover:bg-blue-200/50'
      }`}
      onClick={onClick}
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
      <div className="pl-[0.2rem]">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={tempLabel}
            onChange={(e) => setTempLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-b border-blue-300/50 outline-none text-blue-900"
          />
        ) : (
          <button onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}>{label}</button>
        )}
      </div>
    </div>
  );
}

