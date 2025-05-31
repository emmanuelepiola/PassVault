import { Menu, Search } from 'lucide-react';
import { useSelection } from '../context';

export default function SearchBar() {
  const { searchTerm, setSearchTerm, selection } = useSelection();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const hideOnMobile = selection === 'Password Generator' || selection === 'Settings';

  const handleMenuClick = () => {
    window.dispatchEvent(new Event('show-sidebar'));
  };

  return (
    <div className="h-[5rem] py-[1rem] pl-[0.8rem] md:h-[4rem] w-full md:pl-[1rem] md:pr-[1rem] md:pt-[1rem] md:pb-[1rem]">
      <div className="h-full w-full flex items-center relative">
        <div className="flex mr-4 md:hidden items-center gap-2">
          <Menu className="text-gray-600 w-10 h-10" onClick={handleMenuClick} />
        </div>

        <div className={`${hideOnMobile ? 'hidden md:flex' : 'flex'} w-full h-10 md:h-full items-center relative`}>
          <Search className="absolute md:top-1 top-2 md:left-2 left-3 text-gray-600 w-6 h-6" />
          <form action="" className="h-full w-full" onSubmit={(e) => e.preventDefault()}>
            <input
              className="border-1 bg-white border-gray-600 h-full w-full rounded-3xl pl-[2.5rem] pr-[1rem] outline-none md:text-base text-2xl"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleChange}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
