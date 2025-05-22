'use client'

import { FolderPlus } from 'lucide-react';

type Props = {
  label: string;
  addFolder: () => void;
};

export default function FolderLabel({ label, addFolder }: Props) {
  return (
    <div className="w-full flex md:pl-[1rem] md:pr-[1rem] p-0 pr-0 relative items-center">
      <label className="w-full bg-transparent md:px-0 px-4 md:py-0 py-2 md:text-xl text-3xl border-b border-gray-500">
        {label} Folders
      </label>
      <button onClick={addFolder}>
        <FolderPlus
          className="absolute right-[1.6rem] bottom-3 md:right-4 md:bottom-0.5 cursor-pointer 
          text-gray-500 hover:text-black hover:scale-110 transition duration-200 md:h-5 md:w-5 h-7 w-7"
        />
      </button>
    </div>
  );
}
