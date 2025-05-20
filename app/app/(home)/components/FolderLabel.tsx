'use client'

type Props = {
  label: string;
  addFolder: () => void;
};

export default function FolderLabel({ label, addFolder }: Props) {
  return (
    <div className="w-full flex pl-[1rem] pr-[1rem] relative items-center">
      <label className="w-full text-xl border-b border-gray-500">
        {label} Folders
      </label>
      <button onClick={addFolder}>
        <span
          className="material-symbols-outlined absolute right-4 bottom-0.5 cursor-pointer 
          text-gray-500 hover:text-black hover:scale-110 transition duration-200"
        >
          create_new_folder
        </span>
      </button>
    </div>
  );
}
