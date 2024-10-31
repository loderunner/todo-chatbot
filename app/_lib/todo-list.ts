import Ajv, { JSONSchemaType } from 'ajv';
import OpenAI from 'openai';

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
