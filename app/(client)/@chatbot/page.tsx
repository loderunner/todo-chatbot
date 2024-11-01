'use client';

import { useIsClient } from '@uidotdev/usehooks';
import { ChatCompletion } from 'openai/resources/index.mjs';
import { useCallback } from 'react';

import Chatbot from './Chatbot';

import useTodoList from '@/_lib/useTodoList';

function ClientComponent() {
  const { todoList, addTodo, updateTodo, removeTodo } = useTodoList();

  const onSendMessage = useCallback(
    async (message: string) => {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message, context: todoList }),
      });

      if (!res.ok) {
        return;
      }

      const body: ChatCompletion = await res.json();
      for (const choice of body.choices) {
        if (choice.finish_reason === 'tool_calls') {
          for (const call of choice.message.tool_calls ?? []) {
            const args = JSON.parse(call.function.arguments);

            if (call.function.name === 'addTodo') {
              addTodo(args);
            } else if (call.function.name === 'removeTodo') {
              removeTodo(args);
            } else if (call.function.name === 'updateTodo') {
              updateTodo(args);
            }
          }
        } else if (choice.finish_reason === 'stop') {
          alert(choice.message.content);
        } else if (choice.finish_reason === 'content_filter') {
          alert(choice.message.refusal);
        }
      }
    },
    [addTodo, removeTodo, todoList, updateTodo],
  );

  return <Chatbot onSendMessage={onSendMessage} />;
}

export default function Page() {
  const isClient = useIsClient();
  return isClient ? <ClientComponent /> : null;
}
