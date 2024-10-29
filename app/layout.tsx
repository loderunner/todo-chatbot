import { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Todo Chatbot',
  description: 'Todo app powered by a chatbot',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
