'use client'

import { useState } from 'react';

type Props = {
    label: string;
};

export default function AddButton({ label }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddItem = (data: { tag: string; website: string }) => {
        // Handle adding new item here
        console.log('Adding item:', data);
    };

    return (
        <button 
            onClick={() => setIsModalOpen(true)}
            className="absolute bg-blue-100/80 right-0 top-8 flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors rounded-3xl border-2 border-black py-[0.1rem] px-[0.5rem]"
        >
            <span className="material-symbols-outlined text-2xl">add_circle</span>
            <span className="font-medium">Add {label}</span>
        </button>
    );
}