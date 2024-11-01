import Ajv, { JSONSchemaType } from 'ajv';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { TodoList, todoItemSchema, todoListSchema } from '@/_lib/todo';

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

  try {
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
  } catch (err) {
    console.error(err);
    return new Response(null, { status: 500 });
  }
}

const addTodoSchema: OpenAI.Chat.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'addTodo',
    description: `/**
 * Add a todo item to the list.
 * 
 * @param item {TodoItem} - todo item to add to the list
 */`,
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        item: todoItemSchema,
      },
      required: ['item'],
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
