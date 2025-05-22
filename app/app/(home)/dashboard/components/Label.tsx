import AddButton from "./AddButton";
import SearchBar from "../../components/SearchBar";

type props = {
  label: string;
};

export default function Label({ label }: props) {
  return (
    <div className="mr-[2rem] ml-4 md:ml-[2rem] md:pt-[1.8rem] md:pb-[2rem] relative">
      {label !== "Password Generator" && label !== "Settings" && <AddButton />}

      {/* Mobile: mostra SearchBar */}
      <div className="block md:hidden">
        <SearchBar />
      </div>

      {/* Desktop: mostra label */}
      <label className="hidden md:block w-full pb-0 text-4xl">{label}</label>
    </div>
  );
}

