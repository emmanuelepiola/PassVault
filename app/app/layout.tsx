'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link
                  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
                  rel="stylesheet"
                />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </head>
            <body className="w-screen h-screen">
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
                    {children}
                </GoogleOAuthProvider>
            </body>
        </html>
    )
}