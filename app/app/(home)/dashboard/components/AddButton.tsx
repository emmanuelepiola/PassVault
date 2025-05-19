'use client'

import { useState } from 'react';
import Modal from './AddItemModal';

export default function AddButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddItem = (data: { tag: string; website: string }) => {
        // Handle adding new item here
        console.log('Adding item:', data);
    };

    return (
        <div>
            <button 
            onClick={() => setIsModalOpen(true)}
            className="absolute bg-blue-100 right-0 top-8 flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors rounded-3xl border-1 border-black py-[0.1rem] px-[0.5rem]"
            >
                <span className="material-symbols-outlined text-2xl">add_circle</span>
                <span className="font-medium">AddButton</span>
            </button>
            <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
        </div>
        
    );
}