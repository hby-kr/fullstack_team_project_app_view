import React from "react"
import { Navigation } from "src/components/navigation"

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-grow">{children}</main>
            <footer className="bg-gray-100 py-6">
                <div className="container mx-auto px-4">
                    <p className="text-center text-gray-600 text-sm">© 2024 아트유. 모든 권리 보유.</p>
                </div>
            </footer>
        </div>
    )
}

