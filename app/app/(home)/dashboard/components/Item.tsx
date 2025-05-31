'use client';

import { useState } from 'react';
import DisplayModal from './DisplayModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal'; 
import { useSelection } from "../../context";

type SecurityLevel = 'low' | 'medium' | 'high';

type Props = {
  id: string;
  tag: string;
  website: string;
  securityLevel: SecurityLevel;
  folderID: string | null;
  username: string;
  password: string;
  ownerEmail: string;
};

export default function PasswordItem({
  id,
  tag,
  website,
  securityLevel,
  folderID,
  username,
  password,
  ownerEmail,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 
  const { deleteItem, account } = useSelection();

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
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteItem(id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const getDisplayDomain = (url: string) => {
    try {
      const { hostname } = new URL(url.startsWith('http') ? url : `http://${url}`);
      return hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  return (
    <>
      <div
        className="bg-white flex items-center px-8 md:px-8 w-full h-[4rem] border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center justify-between w-full">
          <label className="text-gray-900 font-medium w-1/4">{tag}</label>

          <div className="hidden md:flex w-1/4">
            <a
              href={website.startsWith('http') ? website : `http://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-600 hover:underline truncate"
              style={{ maxWidth: '100%' }}
            >
              {getDisplayDomain(website)}
            </a>
          </div>
      
          <div className="flex items-center gap-1 w-1/4">
            {getSecurityColors()
              .split(' ')
              .map((color, index) => (
                <div key={index} className={`w-12 h-1 ${color}`} />
              ))}
          </div>

            {account === ownerEmail ? (
              <span
                className="material-symbols-outlined cursor-pointer text-gray-500 hover:text-red-500"
                onClick={handleDeleteClick}
                style={{ minWidth: 24, textAlign: 'center' }} 
              >
                delete
              </span>
            ) : (
              <span style={{ minWidth: 24, display: 'inline-block' }} /> 
            )}

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
        securityLevel={securityLevel}
        folderID={folderID}
      />

      {showDeleteConfirm && (
        <DeleteConfirmationModal
          folderName={tag}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
}
