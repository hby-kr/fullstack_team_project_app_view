import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"

import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "art U",
  description: "다양한 예술 분야의 콘텐츠를 제공하는 커뮤니티 플랫폼",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

import "./globals.css"

import "./globals.css"

import "./globals.css"

import "./globals.css"

import "./globals.css"

import "./globals.css"



import './globals.css'