type Props = {
    onAddFolder: () => void;
  };
  
  export default function SideBarFolderLabel({ onAddFolder }: Props) {
    return (
      <div className="w-full flex pl-[1rem] pr-[1rem] relative">
        <label className="w-full border-b-2 border-black">Folders</label>
        <button onClick={onAddFolder}>
          <span className="material-symbols-outlined absolute right-4 bottom-0.5 cursor-pointer">
            create_new_folder
          </span>
        </button>
      </div>
    );
  }
  