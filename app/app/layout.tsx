import './globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head>
                <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
                rel="stylesheet"
                />
            </head>
            <body className="w-[100dvw] h-[100dvh] overflow-hidden">
             {children}
            </body>
        </html>
    )
}