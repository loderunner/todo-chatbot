import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/_store';
import { TodoItem, actions } from '@/_store/todo';

export default function useTodoList() {
  const todoList = useSelector((state: RootState) => state.todo);
  const dispatch = useDispatch();

  const addTodo = useCallback(
    (item: TodoItem) => {
      dispatch(actions.addTodo(item));
    },
    [dispatch],
  );

  const updateTodo = useCallback(
    (index: number, item: TodoItem) => {
      dispatch(actions.updateTodo({ index, item }));
    },
    [dispatch],
  );

  const removeTodo = useCallback(
    (index: number) => {
      dispatch(actions.removeTodo(index));
    },
    [dispatch],
  );

  return useMemo(
    () => ({
      todoList,
      addTodo,
      removeTodo,
      updateTodo,
    }),
    [addTodo, removeTodo, todoList, updateTodo],
  );
}
