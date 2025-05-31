'use client'

import { useState } from 'react';
import Modal from './AddItemModal';

{/* Add button for the dashboard */}

export default function AddButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="
          hover:scale-110 transition-transform duration-200 ease-in-out
          fixed right-10 bottom-20 
          md:absolute md:top-8 md:right-0 md:bottom-auto 
          bg-blue-100 
          text-gray-600 hover:text-gray-900
          flex items-center justify-center 
          w-20 h-20
          rounded-full 
          border-1 border-gray-600
          p-0 

          md:w-auto md:h-auto md:rounded-3xl 
          md:py-[0.1rem] md:px-[0.5rem]
        "
      >
        <div className="text-6xl pb-[0.7rem] md:text-base md:font-medium md:mr-1 md:pb-[0.1rem]">+</div>
        <span className="hidden md:inline font-medium">Add Item</span>
      </button>

      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
