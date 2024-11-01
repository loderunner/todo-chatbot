import {
  PayloadAction,
  createListenerMiddleware,
  createSlice,
  isAnyOf,
} from '@reduxjs/toolkit';

import { AppDispatch, RootState } from '.';

import { TodoItem, TodoList, validate } from '@/_lib/todo';

const defaultState: TodoList = [
  { label: 'Read the docs', done: true },
  { label: "Cross the T's", done: false },
  { label: "Dot the i's", done: false },
];

const initialState: () => TodoList = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  const data = localStorage.getItem('todo-list');
  if (data === null) {
    return defaultState;
  }

  try {
    const todoList = JSON.parse(data);
    if (validate(todoList)) {
      return todoList;
    }
    return defaultState;
  } catch (_) {
    return defaultState;
  }
};

export const slice = createSlice({
  name: 'todoList',
  initialState,
  reducers: {
    addTodo: (state, { payload: item }: PayloadAction<TodoItem>) => {
      state.push(item);
    },
    removeTodo: (state, { payload: index }: PayloadAction<number>) => {
      state.splice(index, 1);
    },
    updateTodo: (
      state,
      {
        payload: { index, item },
      }: PayloadAction<{ index: number; item: TodoItem }>,
    ) => {
      state.splice(index, 1, item);
    },
  },
});

const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  matcher: isAnyOf(...Object.values(slice.actions)),
  effect: (_, { getState }) => {
    const state = getState();
    localStorage.setItem('todo-list', JSON.stringify(state.todo));
  },
});
export const middleware = listenerMiddleware.middleware;

export const actions = slice.actions;
export default slice.reducer;
