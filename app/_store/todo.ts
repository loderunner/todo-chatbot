import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import Ajv, { JSONSchemaType } from 'ajv';

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

const initialState: TodoList = [
  { label: "Cross the T's", done: false },
  { label: "Dot the i's", done: false },
  { label: 'Read the docs', done: true },
];

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

export const actions = slice.actions;
export default slice.reducer;
