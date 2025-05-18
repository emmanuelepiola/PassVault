'use client'

import { useRouter } from 'next/navigation';

type Props = {
    id: string;
    label: string;
    icon: string;
    isSelected: boolean;
    onClick: () => void;
};

export default function SideBarButton({ id, label, icon, isSelected, onClick }: Props) {
    const router = useRouter();

    const handleClick = () => {
        if (id === 'all-items') {
            router.push('/dashboard');
        }
        else {
            router.push(`/${id}`);
        }
        onClick();
    };

    return (
        <div
            className={`w-full flex flex-row items-center pt-[0.5rem] pb-[0.5rem] pl-[1.5rem] pr-[1.5rem] cursor-pointer transition-all duration-200 ${
                isSelected 
                    ? 'bg-blue-200/80 text-blue-900 font-medium' 
                    : 'text-blue-800/80 hover:bg-blue-200/50'
            }`}
            onClick={handleClick}
        >
            <span className="material-symbols-outlined text-lg">{icon}</span>
            <div className="pl-[0.2rem]">
                <button className="bg-transparent focus:outline-none">{label}</button>
            </div>
        </div>
    );
}
  