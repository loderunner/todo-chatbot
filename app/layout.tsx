import { Metadata } from 'next';
import { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'Todo Chatbot',
  description: 'Todo app powered by a chatbot',
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <h1 className="text-6xl">Todo Chatbot</h1>
        {children}
      </body>
    </html>
  );
}
