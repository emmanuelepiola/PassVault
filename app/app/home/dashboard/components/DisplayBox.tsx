'use client'

import { useState } from 'react';

type Props = {
    label: string;
    password: string;
    onClose: () => void;
};

export default function PasswordDisplayBox({ label, password, onClose }: Props) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-xl p-6 w-[32rem]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{label}</h2>
                <button 
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                    <span className="font-mono">
                        {isPasswordVisible ? password : '•'.repeat(password.length)}
                    </span>
                </div>
                <button 
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <span className="material-symbols-outlined">
                        {isPasswordVisible ? 'visibility_off' : 'visibility'}
                    </span>
                </button>
            </div>

            <div className="flex justify-end gap-3">
                <button 
                    onClick={() => navigator.clipboard.writeText(password)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Copy
                </button>
            </div>
        </div>
    );
} 