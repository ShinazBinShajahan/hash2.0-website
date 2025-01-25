import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "HASH 2.0",
  description: "Technical Fest 2025",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

