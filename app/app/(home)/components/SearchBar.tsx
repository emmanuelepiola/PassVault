'use client';

import { useSelection } from '../context';

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useSelection();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="h-[4rem] w-full pl-[1rem] pr-[1rem] pt-[1rem] pb-[1rem]">
      <div className="h-full w-full relative">
        <span className="material-symbols-outlined absolute top-1 left-2">search</span>
        <form action="" className="h-full w-full" onSubmit={(e) => e.preventDefault()}>
          <input
            className="border-2 border-black h-full w-full rounded-3xl pl-[2rem] pr-[1rem] outline-none"
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
