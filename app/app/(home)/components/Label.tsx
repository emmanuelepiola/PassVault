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
    <div className="w-full md:h-auto md:border-0 border-b-1 border-gray-500 h-[3rem] flex items-center py-[2rem] md:py-0 md:pl-[1rem] md:pr-[1rem] relative">
      <label className="w-full md:px-0 px-4 md:border-b-1 md:text-xl text-3xl md:border-gray-500">
        {label}
      </label>

      {/* Icona di chiusura - solo su mobile */}
      <div className="md:hidden absolute right-5 top-[2rem] -translate-y-1/2">
        <X className="w-10 h-10 text-gray-600 cursor-pointer hover:text-black transition" onClick={handleClose} />
      </div>
    </div>
  );
}
