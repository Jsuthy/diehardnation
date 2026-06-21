import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'DieHardNation \u2014 Fan Gear & Sports News for Every Team',
    template: '%s | DieHardNation',
  },
  description: 'Shop fan gear and follow the latest sports news for every team, league and sport \u2014 NFL, NBA, MLB, NHL, soccer, college and more. Jerseys, hoodies, hats and accessories, updated daily.',
  metadataBase: new URL('https://diehardnation.com'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7PP3TX2XFB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7PP3TX2XFB');
          `}
        </Script>
      </head>
      <body style={{ fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <Navbar />
        {children}
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': 'https://diehardnation.com/#organization',
              name: 'DieHardNation',
              url: 'https://diehardnation.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://diehardnation.com/logo-mark.png',
              },
              description: 'Independent fan gear aggregator and sports hub. DieHardNation compares officially licensable jerseys, hoodies, hats and apparel from eBay and Amazon across college and pro teams, leagues and major events.',
              knowsAbout: [
                'college football fan gear', 'NFL fan gear', 'NBA fan gear',
                'MLB fan gear', 'NHL fan gear', 'soccer kits', 'sports apparel',
                'team jerseys', 'fan hoodies', 'officially licensed sports merchandise',
              ],
              sameAs: ['https://twitter.com/diehardnation'],
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'DieHardNation',
              url: 'https://diehardnation.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://diehardnation.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
      </body>
    </html>
  )
}
