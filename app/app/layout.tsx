import './globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
            </head>
            <body className="w-screen h-screen">
             {children}
            </body>
        </html>
    )
}