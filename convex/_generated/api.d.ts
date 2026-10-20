/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as generation from "../generation.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_folders from "../lib/folders.js";
import type * as lib_mockGeneration from "../lib/mockGeneration.js";
import type * as lib_validators from "../lib/validators.js";
import type * as messages from "../messages.js";
import type * as myFunctions from "../myFunctions.js";
import type * as outline from "../outline.js";
import type * as presentations from "../presentations.js";
import type * as slides from "../slides.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  generation: typeof generation;
  "lib/auth": typeof lib_auth;
  "lib/folders": typeof lib_folders;
  "lib/mockGeneration": typeof lib_mockGeneration;
  "lib/validators": typeof lib_validators;
  messages: typeof messages;
  myFunctions: typeof myFunctions;
  outline: typeof outline;
  presentations: typeof presentations;
  slides: typeof slides;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
