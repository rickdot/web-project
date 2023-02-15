// importing dependencies(external libraries)
// make sure that the dependencies are the same across the project
// and that updating dependency versions is straightforward

export { configure, renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
export {
  Application,
  Router,
  send,
} from "https://deno.land/x/oak@v9.0.1/mod.ts";
export { Pool } from "https://deno.land/x/postgres@v0.13.0/mod.ts";
export { Session } from "https://deno.land/x/oak_sessions@v3.1.3/mod.ts";
export * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
export {
  isEmail,
  minLength,
  required,
  validate,
} from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

export { superoak } from "https://deno.land/x/superoak@4.4.0/mod.ts";
export { assertStringIncludes } from "https://deno.land/std@0.113.0/testing/asserts.ts";