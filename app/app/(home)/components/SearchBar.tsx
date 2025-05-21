'use client';

import { useSelection } from '../context';

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useSelection();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="h-[3rem] md:h-[4rem] w-full md:pl-[1rem] md:pr-[1rem] md:pt-[1rem] md:pb-[1rem]">
      <div className="h-full w-full relative">
        <span className="material-symbols-outlined absolute md:top-1 top-3 left-2 text-gray-600">search</span>
        <form action="" className="h-full w-full" onSubmit={(e) => e.preventDefault()}>
          <input
            className="border-1 bg-white border-gray-600 h-full w-full rounded-3xl pl-[2rem] pr-[1rem] outline-none"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleChange}
          />
        </form>
      </div>
    </div>
  );
}
