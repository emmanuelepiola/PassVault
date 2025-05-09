import './globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body className="w-screen h-screen">
             {children}
            </body>
        </html>
    )
}