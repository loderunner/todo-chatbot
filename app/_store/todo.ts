import {
  PayloadAction,
  createListenerMiddleware,
  createSlice,
  isAnyOf,
} from '@reduxjs/toolkit';
import Ajv, { JSONSchemaType } from 'ajv';

import { AppDispatch, RootState } from '.';

export type TodoItem = {
  label: string;
  done: boolean;
};

export const todoItemSchema: JSONSchemaType<TodoItem> = {
  type: 'object',
  properties: {
    label: { type: 'string' },
    done: { type: 'boolean' },
  },
  additionalProperties: false,
  required: ['label', 'done'],
};

export type TodoList = TodoItem[];

export const todoListSchema: JSONSchemaType<TodoList> = {
  type: 'array',
  items: todoItemSchema,
};

export const validate = new Ajv().compile(todoListSchema);

const defaultState: TodoList = [
  { label: 'Read the docs', done: true },
  { label: "Cross the T's", done: false },
  { label: "Dot the i's", done: false },
];

const initialState: () => TodoList = () => {
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
