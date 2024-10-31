'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/_store';

export default function ClientLayout({
  todoList,
  chatbot,
}: {
  todoList: ReactNode;
  chatbot: ReactNode;
}) {
  return (
    <Provider store={store}>
      {todoList}
      {chatbot}
    </Provider>
  );
}
