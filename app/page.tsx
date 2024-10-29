'use client';

import TodoList from './_components/TodoList';
import { useTodoList } from './_lib/useTodoList';

export default function Page() {
  const { todoList, addTodo, removeTodo, setTodo } = useTodoList();
  return (
    <TodoList
      list={todoList}
      onAddItem={() => addTodo('')}
      onChangeItem={setTodo}
      onRemoveItem={removeTodo}
    />
  );
}
