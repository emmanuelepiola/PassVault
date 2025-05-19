type Props = {
    label : string;
    addFolder: () => void;
  };
  
  export default function FolderLabel({ label , addFolder }: Props) {
    return (
      <div className="w-full flex pl-[1rem] pr-[1rem] relative">
        <label className="w-full border-b-2 border-black">{label} Folders</label>
        <button onClick={addFolder}>
          <span className="material-symbols-outlined absolute right-4 bottom-0.5 cursor-pointer">
            create_new_folder
          </span>
        </button>
      </div>
    );
  }
  