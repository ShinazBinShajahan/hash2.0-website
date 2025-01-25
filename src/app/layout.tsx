import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HASH 2.0",
  description: "Annual Techno-Cultural fest of CSE department - MBCCET",
  icons: {
    icon: [
      { url: "/hash.png" },
      { url: "/hash.png", sizes: "16x16", type: "image/png" },
      { url: "/hash.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/hash.png" }],
  },
  openGraph: {
    title: "HASH 2.0",
    description: "Annual Techno-Cultural fest of CSE department - MBCCET",
    url: "https://hash2025.vercel.app",
    siteName: "HASH 2.0",
    images: [
      {
        url: "/hash.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HASH 2.0",
    description: "Annual Techno-Cultural fest of CSE department - MBCCET",
    images: ["/hash.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

