import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Carpark Information',
  description: 'Qashier Carpark Information Assessment',
  authors: [
    {
      name: 'haikhalfakhreez',
      url: 'https://haikhalfakhreez.com',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`antialiased bg-white min-h-screen flex flex-col ${inter.className}`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
