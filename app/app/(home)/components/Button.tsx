'use client'
import { useSelection } from '../context';

type Props = {
    label: string;
    icon: string;
};

export default function Button({ label, icon }: Props) {
    const { selection, setSelection } = useSelection();
    const isSelected = (selection === label);

    function handleClick(){
        setSelection(label);
    }

    return (
        <div
          onClick={handleClick} className={`w-full flex items-center px-6 py-2 cursor-pointer transition-colors duration-200 
            ${isSelected ? 'bg-blue-200 text-white' : 'hover:bg-gray-100 text-gray-800'}`}
        >
          <span className="material-symbols-outlined text-lg">{icon}</span>
          <div className="pl-2">
            {label}
          </div>
        </div>
      );      
}
  