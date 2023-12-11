import './globals.css'
import Header from "@/app/components/Header";
import {AppContextProvider} from "@/app/hooks/AppContext";
import AuthProvider from "@/app/hooks/AuthProvider";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Social Boards',
  description: '',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body className={inter.className}>
          <div className="mx-auto max-w-4xl px-4">
            <AppContextProvider>
              <AuthProvider>
                <Header />
                {children}
              </AuthProvider>
            </AppContextProvider>
          </div>
        </body>
    </html>
  )
}
