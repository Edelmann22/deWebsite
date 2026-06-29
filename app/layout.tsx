import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
// @ts-ignore: side-effect import of global CSS
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
})

const _jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'deutschStube - Language Course Scheduler',
  description: 'Schedule and manage your language classes, lessons, and homework all in one place.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/dudlogo.png',
        type: 'image/png',
      },
    ],
    apple: '/dudlogo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
