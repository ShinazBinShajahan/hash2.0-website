import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "HASH 2.0",
  description: "Annual Techno-Cultural fest of CSE department - MBCCET",
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

