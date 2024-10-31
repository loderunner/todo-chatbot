import Ajv, { JSONSchemaType } from 'ajv';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

import { todoItemSchema, TodoList, todoListSchema } from '@/app/_lib/todo-list';

type Body = {
  context: TodoList;
  message: string;
};

const bodySchema: JSONSchemaType<Body> = {
  type: 'object',
  properties: {
    context: todoListSchema,
    message: { type: 'string' },
  },
  additionalProperties: false,
  required: ['message'],
};
const validateBody = new Ajv().compile(bodySchema);

const openAI = new OpenAI();

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  if (!validateBody(body)) {
    return new NextResponse(`Invalid payload: ${validateBody.errors}`);
  }

  const chat = await openAI.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Given the following todo list in JSON format:
\`\`\`json
${JSON.stringify(body.context, null, 2)}
\`\`\`
Accomplish the user's goals as best you can, using the provided functions.
`,
      },
      {
        role: 'user',
        content: body.message,
      },
    ],
    tools: [addTodoSchema, removeTodoSchema, updateTodoSchema],
  });

  return Response.json(chat);
}

const addTodoSchema: OpenAI.Chat.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'addTodo',
    description: `/**
 * Add a todo item with the given \`label\` to the list.
 * 
 * @param label {string} - label of the todo item
 */`,
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        label: { type: 'string' },
      },
      required: ['label'],
      additionalProperties: false,
    },
  },
};

const removeTodoSchema: OpenAI.Chat.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'removeTodo',
    description: `/**
 * Remove the todo item at index \`index\` from the list.
 * 
 * @param index {number} - index of the todo item in the list
 */`,
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        index: { type: 'integer' },
      },
      required: ['index'],
      additionalProperties: false,
    },
  },
};

const updateTodoSchema: OpenAI.Chat.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'updateTodo',
    description: `/**
 * Update the todo item at index \`index\` in the list with the data from \`item\`.
 * 
 * @param index {number} - index of the todo item in the list
 * @param item {TodoItem} - item data to update with
 */`,
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        index: { type: 'integer' },
        item: todoItemSchema,
      },
      required: ['index', 'item'],
      additionalProperties: false,
    },
  },
};
