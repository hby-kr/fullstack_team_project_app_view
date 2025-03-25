import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "/src/lib/auth-context";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "art U",
  description: "다양한 예술 분야의 콘텐츠를 제공하는 커뮤니티 플랫폼",
  generator: "Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}



import './globals.css'