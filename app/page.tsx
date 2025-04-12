'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';

export default function Logo() {
    const router = useRouter();
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                router.push('/login');
            }, 800);
        }, 2200);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className={`flex items-center justify-center w-full h-full ${fadeOut ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
            <svg
                className="animate-pulseSlow"
                width="180"
                height="180"
                viewBox="0 0 180 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M180 90C180 139.706 139.706 180 90 180C40.2944 180 0 139.706 0 90C0 40.2944 40.2944 0 90 0C139.706 0 180 40.2944 180 90Z" fill="#54A9DA" />
                <path d="M117 63.5C117 77.5833 105.807 89 92 89C78.1929 89 67 77.5833 67 63.5C67 49.4167 78.1929 38 92 38C105.807 38 117 49.4167 117 63.5Z" fill="white" />
                <path d="M90.5 63L123 132H58L90.5 63Z" fill="white" />
            </svg>
        </div>
    );
}
