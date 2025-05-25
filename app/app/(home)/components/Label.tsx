'use client'

import { X } from 'lucide-react';

type Props = {
  label: string;
};

export default function Label({ label }: Props) {
  const handleClose = () => {
    window.dispatchEvent(new Event('hide-sidebar'));
  };

  return (
    <div className="w-full border-0 h-[3rem] flex items-center py-[1rem] pl-[1rem] pr-[1rem] relative">
      <label className="w-full px-0 border-b-1 text-xl border-gray-500">
        {label}
      </label>

      {/* Icona di chiusura - solo su mobile */}
      <div className="md:hidden absolute right-5 top-[1rem] -translate-y-1/2">
        <X className="w-10 h-10 text-gray-600 cursor-pointer hover:text-black transition" onClick={handleClose} />
      </div>
    </div>
  );
}