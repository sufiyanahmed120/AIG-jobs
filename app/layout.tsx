import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AGI Job Portal - Find Jobs in Gulf Countries & South Asia',
  description: 'Find your next job opportunity in Gulf countries and South Asia. Connect with top employers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DataProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>

            {/* Chatbot Component */}
            <Chatbot />

            {/* WhatsApp Floating Button */}
            <a
              href="https://wa.me"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg p-3 md:p-4 flex items-center justify-center whatsapp-pulse"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-6 h-6 md:w-7 md:h-7"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M16 3C9.37 3 4 8.16 4 14.5c0 2.54.86 4.89 2.33 6.8L4 29l7.97-2.26C13.2 27.33 14.57 27.6 16 27.6 22.63 27.6 28 22.44 28 16.1 28 9.76 22.63 4.6 16 4.6zm0 2.4c5.08 0 9.2 3.86 9.2 8.7 0 4.83-4.12 8.7-9.2 8.7-1.3 0-2.57-.25-3.73-.75l-.27-.11-4.7 1.33 1.33-4.2-.18-.27C7.02 19.05 6.4 17.64 6.4 15.9 6.4 9.96 10.92 5.4 16 5.4zm-4.02 4.07c-.22-.49-.45-.5-.66-.5-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.48 0 1.46 1.08 2.87 1.23 3.06.15.19 2.07 3.3 5.1 4.49 2.52.99 3.03.89 3.57.83.54-.06 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.35-.3-.16-1.76-.87-2.03-.97-.27-.1-.47-.16-.66.16-.2.31-.76.97-.93 1.18-.17.21-.34.24-.64.08-.3-.16-1.27-.47-2.42-1.5-.9-.8-1.51-1.79-1.69-2.1-.17-.31-.02-.48.13-.64.13-.13.3-.35.45-.52.15-.17.2-.29.3-.48.1-.19.05-.36-.03-.52-.08-.16-.71-1.77-.98-2.42z"
                />
              </svg>
            </a>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
