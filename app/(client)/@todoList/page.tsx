'use client';

import { useIsClient } from '@uidotdev/usehooks';

import TodoList from './TodoList';

import useTodoList from '@/_lib/useTodoList';

function ClientComponent() {
  const { todoList, addTodo, updateTodo, removeTodo } = useTodoList();

  return (
    <TodoList
      list={todoList}
      onAddItem={() => addTodo({ label: '', done: false })}
      onChangeItem={updateTodo}
      onRemoveItem={removeTodo}
    />
  );
}

export default function Page() {
  const isClient = useIsClient();
  return isClient ? <ClientComponent /> : null;
}
