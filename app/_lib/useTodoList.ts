import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/_store';
import { actions } from '@/_store/todo';

export default function useTodoList() {
  const todoList = useSelector((state: RootState) => state.todo);
  const dispatch = useDispatch();

  const addTodo = useCallback(
    ({ item }: Parameters<typeof actions.addTodo>[0]) => {
      dispatch(actions.addTodo({ item }));
    },
    [dispatch],
  );

  const updateTodo = useCallback(
    ({ id, item }: Parameters<typeof actions.updateTodo>[0]) => {
      dispatch(actions.updateTodo({ id, item }));
    },
    [dispatch],
  );

  const removeTodo = useCallback(
    ({ id }: Parameters<typeof actions.removeTodo>[0]) => {
      dispatch(actions.removeTodo({ id }));
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
