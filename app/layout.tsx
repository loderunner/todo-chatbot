import { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Todo Chatbot',
  description: 'Todo app powered by a chatbot',
};

export default function RootLayout({
  todoList,
  chatbot,
}: Readonly<{ todoList: React.ReactNode; chatbot: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <h1 className="text-6xl">Todo Chatbot</h1>
        {todoList}
        {chatbot}
      </body>
    </html>
  );
}
