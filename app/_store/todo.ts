import {
  PayloadAction,
  createListenerMiddleware,
  createSlice,
  isAnyOf,
  nanoid,
} from '@reduxjs/toolkit';

import { AppDispatch, RootState } from '.';

import { TodoItem, TodoList, validate } from '@/_lib/todo';

const idSize = 6;
const itemId = () => nanoid(idSize);

const defaultState: () => TodoList = () => [
  { id: itemId(), label: 'Read the docs', done: true },
  { id: itemId(), label: "Cross the T's", done: false },
  { id: itemId(), label: "Dot the i's", done: false },
];

const initialState: () => TodoList = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  const data = localStorage.getItem('todo-list');
  if (data === null) {
    return defaultState();
  }

  try {
    const todoList = JSON.parse(data);
    if (validate(todoList)) {
      return todoList;
    }
    return defaultState();
  } catch (_) {
    return defaultState();
  }
};

export type ItemPayload = Omit<TodoItem, 'id'>;

export const slice = createSlice({
  name: 'todoList',
  initialState,
  reducers: {
    addTodo: (
      state,
      { payload: { item } }: PayloadAction<{ item: ItemPayload }>,
    ) => {
      state.push({ ...item, id: itemId() });
    },
    removeTodo: (state, { payload: { id } }: PayloadAction<{ id: string }>) => {
      return state.filter((item) => item.id !== id);
    },
    updateTodo: (
      state,
      {
        payload: { id, item },
      }: PayloadAction<{ id: string; item: ItemPayload }>,
    ) => {
      const index = state.findIndex((item) => item.id === id);
      if (index === -1) {
        return;
      }
      state[index] = { id, ...item };
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
