import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback } from 'react';

import { TodoItem, TodoList, validate } from './todo-list';

const localStorageKey = 'todo-list';

const defaultList = JSON.stringify([
  { label: "Cross the T's", done: false },
  { label: "Dot the i's", done: false },
  { label: 'Read the docs', done: true },
] satisfies TodoList);

export function useTodoList() {
  const [listData, setListData] = useLocalStorage(localStorageKey, defaultList);
  let list: TodoList;
  try {
    list = JSON.parse(listData);
  } catch (_) {
    list = [];
  }
  if (!validate(list)) {
    list = [];
  }

  const addTodo = useCallback(
    (label: string) =>
      setListData(JSON.stringify([...list, { label, done: false }])),
    [list, setListData],
  );

  const removeTodo = useCallback(
    (index: number) =>
      setListData(
        JSON.stringify([...list.slice(0, index), ...list.slice(index + 1)]),
      ),
    [list, setListData],
  );

  const updateTodo = useCallback(
    (index: number, todo: TodoItem) =>
      setListData(
        JSON.stringify([
          ...list.slice(0, index),
          { ...todo },
          ...list.slice(index + 1),
        ]),
      ),
    [list, setListData],
  );

  return {
    todoList: list,
    addTodo,
    removeTodo,
    updateTodo,
  };
}
