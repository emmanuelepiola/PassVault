'use client';

import { useSelection } from '../context';
import { Menu, Search } from 'lucide-react';

export default function SearchBar() {
  const { searchTerm, setSearchTerm, selection } = useSelection();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const hideSearch = selection === 'Password Generator' || selection === 'Settings';

  return (
    <div className="h-[5rem] py-[1rem] pl-[0.8rem] md:h-[4rem] w-full md:pl-[1rem] md:pr-[1rem] md:pt-[1rem] md:pb-[1rem]">
      <div className="h-full w-full flex relative">
        {/* Icona Menu - solo su mobile */}
        <div className="flex mr-4 md:hidden items-center gap-2">
          <Menu className="text-gray-600 w-10 h-10" />
        </div>

        {/* Mostra solo se non è nascosta */}
        {!hideSearch && (
          <>
            {/* Icona Search */}
            <Search className="absolute md:top-1 top-3 md:left-2 left-16 text-gray-600 w-6 h-6" />

            <form action="" className="h-full w-full" onSubmit={(e) => e.preventDefault()}>
              <input
                className="border-1 bg-white border-gray-600 h-full w-full rounded-3xl pl-[2.5rem] pr-[1rem] outline-none md:text-base text-2xl"
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
              />
            </form>
          </>
        )}
      </div>
    </div>
  );
}

