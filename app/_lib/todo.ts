import { JSONSchemaType } from 'ajv';

import { ajv } from '@/ajv';

export type TodoItem = {
  id: string;
  label: string;
  done: boolean;
};

export const todoItemSchema: JSONSchemaType<TodoItem> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    label: { type: 'string' },
    done: { type: 'boolean' },
  },
  additionalProperties: false,
  required: ['id', 'label', 'done'],
};

export type TodoList = TodoItem[];

export const todoListSchema: JSONSchemaType<TodoList> = {
  type: 'array',
  items: todoItemSchema,
};

export const validate = ajv.compile(todoListSchema);
