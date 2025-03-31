import React from "react"
import "./globals.css"
import { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "/src/components/theme-provider"
import { AuthProvider } from "/src/lib/auth-context"
import { SettingsProvider } from "/src/lib/settings-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "아트유 - 예술 커뮤니티",
    description: "예술 분야 커뮤니티 및 예매 플랫폼",
}

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
        <body className={inter.className}>
        <AuthProvider>
            <SettingsProvider>{children}</SettingsProvider>
        </AuthProvider>
        </body>
        </html>
    );
}
