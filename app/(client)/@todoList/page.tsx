'use client';

import { useIsClient } from '@uidotdev/usehooks';

import TodoList from './TodoList';

import useTodoList from '@/_lib/useTodoList';

function ClientComponent() {
  const { todoList, addTodo, updateTodo, removeTodo } = useTodoList();

  return (
    <TodoList
      list={todoList}
      onAddItem={() => addTodo({ item: { label: '', done: false } })}
      onChangeItem={(item) => updateTodo({ id: item.id, item })}
      onRemoveItem={(item) => removeTodo({ id: item.id })}
    />
  );
}

export default function Page() {
  const isClient = useIsClient();
  return isClient ? <ClientComponent /> : null;
}
