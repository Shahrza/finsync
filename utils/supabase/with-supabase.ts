import { createClient } from "./server";

export const withSupabase = <T extends any[], R>(
  operation: (supabase: any, ...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    const supabase = await createClient();
    return operation(supabase, ...args);
  };
};
