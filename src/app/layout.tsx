import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import GlobalVoiceNavigation from '@/components/layout/global-voice-navigation'
import { AgeAppropriateCommandsProvider } from '@/components/voice-input/enhanced/age-appropriate-commands'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EdPsych-AI Education Platform',
  description: 'Revolutionizing learning through personalized, engaging, and systematic education',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AgeAppropriateCommandsProvider>
          {children}
          <GlobalVoiceNavigation />
        </AgeAppropriateCommandsProvider>
      </body>
    </html>
  )
}
