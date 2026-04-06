import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'DieHardNation \u2014 College Fan Gear for Every School',
    template: '%s | DieHardNation',
  },
  description: 'Shop college fan gear for all 130 FBS schools. Nebraska, Alabama, Michigan, Ohio State and more. Find jerseys, hoodies, hats and accessories from eBay and Amazon.',
  metadataBase: new URL('https://diehardnation.com'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
