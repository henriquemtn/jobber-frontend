import { Nunito } from 'next/font/google'
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import JobModal from '@/components/modals/JobModal';

export const metadata: Metadata = {
  title: "Jobber",
  description: "Todo list",
};

const font = Nunito({ 
  subsets: ['latin'], 
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Toaster />
        <JobModal />
        {children}
      </body>
    </html>
  );
}
