import { JSONSchemaType } from 'ajv';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { TodoList, todoItemSchema, todoListSchema } from '@/_lib/todo';
import { ToolSchemaType } from '@/_lib/tool-schema';
import { actions } from '@/_store/todo';
import { ajv } from '@/ajv';

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
const validateBody = ajv.compile(bodySchema);

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

const addTodoSchema: ToolSchemaType<typeof actions.addTodo> = {
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
        item: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            done: { type: 'boolean' },
          },
          required: ['label', 'done'],
          additionalProperties: false,
        },
      },
      required: ['item'],
      additionalProperties: false,
    },
  },
};

const removeTodoSchema: ToolSchemaType<typeof actions.removeTodo> = {
  type: 'function',
  function: {
    name: 'removeTodo',
    description: `/**
 * Remove the todo item with id \`id\` from the list.
 * 
 * @param id {string} - the id of the todo item in the list
 */`,
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
      additionalProperties: false,
    },
  },
};

const updateTodoSchema: OpenAI.Chat.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'updateTodo',
    description: `/**
 * Update the todo item with id \`id\` in the list with the data from \`item\`.
 * 
 * @param id {string} - the id of the todo item in the list
 * @param item {TodoItem} - item data to update with
 */`,
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        item: todoItemSchema,
      },
      required: ['id', 'item'],
      additionalProperties: false,
    },
  },
};
