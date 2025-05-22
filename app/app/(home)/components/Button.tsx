'use client'
import { useSelection } from '../context';
import {
  Menu,
  HeartPulse,
  RotateCcw,
  Settings,
  Folder,
  FolderOpenDot,
} from 'lucide-react';

type Props = {
  label: string;
  icon: string;
};

export default function Button({ label, icon }: Props) {
  const { selection, setSelection } = useSelection();
  const isSelected = (selection === label);

  function handleClick() {
    setSelection(label);
    window.dispatchEvent(new Event("hide-sidebar"));
  }

  let IconComponent = null;
  if (icon === 'apps') {
    IconComponent = <Menu className="md:h-5 md:w-5 h-7 w-7" />;
  } else if (icon === 'ecg_heart') {
    IconComponent = <HeartPulse className="md:h-5 md:w-5 h-7 w-7" />;
  } else if (icon === 'lock_reset') {
    IconComponent = <RotateCcw className="md:h-5 md:w-5 h-7 w-7" />;
  } else if (icon === 'settings') {
    IconComponent = <Settings className="md:h-5 md:w-5 h-7 w-7" />;
  } else if (icon === 'folder') {
    IconComponent = <Folder className="md:h-5 md:w-5 h-7 w-7" />;
  } else if (icon === 'folder_shared') {
    IconComponent = <FolderOpenDot className="md:h-5 md:w-5 h-7 w-7" />;
  }

  return (
    <div
      onClick={handleClick}
      className={`w-full flex items-center md:px-6 px-8 py-2 md:text-base text-2xl cursor-pointer transition-colors duration-200 
        ${isSelected ? 'bg-blue-200 text-white' : 'hover:bg-gray-100 text-gray-800'}`}
    >
      {IconComponent}
      <div className="pl-2">
        {label}
      </div>
    </div>
  );
}
