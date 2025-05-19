'use client';

import { useState } from 'react';
import DisplayModal from './DisplayModal';
import { useSelection } from '../../context';

type SecurityLevel = 'low' | 'medium' | 'high';

type Props = {
  id: string;
  tag: string;
  website: string;
  securityLevel: SecurityLevel;
  folderID: string;
  username: string;
  password: string;
};

export default function PasswordItem({
  id,
  tag,
  website,
  securityLevel,
  folderID,
  username,
  password,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteItem } = useSelection();
  const getSecurityColors = () => {
    switch (securityLevel) {
      case 'low':
        return 'bg-red-500 bg-gray-300 bg-gray-300';
      case 'medium':
        return 'bg-yellow-500 bg-yellow-500 bg-gray-300';
      case 'high':
        return 'bg-green-500 bg-green-500 bg-green-500';
      default:
        return 'bg-gray-300 bg-gray-300 bg-gray-300';
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // post request per eliminare l'item tramite id
    // get request per aggiornare la lista degli items
    deleteItem(id);
    console.log('Delete clicked!');
  };

  return (
    <>
      <div
        className="bg-white flex items-center justify-between px-8 w-full h-[4rem] border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center justify-between w-full">
          <label className="text-gray-900 font-medium w-1/4">{tag}</label>
          <label className="text-gray-600 w-1/4">{website}</label>
          <div className="flex items-center gap-1 w-1/4">
            {getSecurityColors()
              .split(' ')
              .map((color, index) => (
                <div key={index} className={`w-12 h-1 ${color}`} />
              ))}
          </div>
          <span
            className="material-symbols-outlined cursor-pointer text-gray-500 hover:text-red-500"
            onClick={handleDeleteClick}
          >
            delete
          </span>
        </div>
      </div>

      <DisplayModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        id={id}
        tag={tag}
        website={website}
        username={username}
        password={password}
      />
    </>
  );
}
