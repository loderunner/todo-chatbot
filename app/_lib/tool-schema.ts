import { JSONSchemaType } from 'ajv';

export type ToolSchemaType<
  F extends (args: any) => unknown,
  Args = Parameters<F>[0] extends object ? Parameters<F>[0] : never,
> = {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters?: JSONSchemaType<Args>;
    strict?: boolean | null;
  };
};
