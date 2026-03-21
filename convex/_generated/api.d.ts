/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as api_gameProgressApi from "../api/gameProgressApi.js";
import type * as api_scoresApi from "../api/scoresApi.js";
import type * as api_usersApi from "../api/usersApi.js";
import type * as config_constants from "../config/constants.js";
import type * as config_index from "../config/index.js";
import type * as crons from "../crons.js";
import type * as gameProgress from "../gameProgress.js";
import type * as lib_gameProgressRules from "../lib/gameProgressRules.js";
import type * as lib_scoreRules from "../lib/scoreRules.js";
import type * as lib_userRules from "../lib/userRules.js";
import type * as model_backendRuleFixtures from "../model/backendRuleFixtures.js";
import type * as model_gameProgressTypes from "../model/gameProgressTypes.js";
import type * as model_scoreTypes from "../model/scoreTypes.js";
import type * as model_userTypes from "../model/userTypes.js";
import type * as scores from "../scores.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "api/gameProgressApi": typeof api_gameProgressApi;
  "api/scoresApi": typeof api_scoresApi;
  "api/usersApi": typeof api_usersApi;
  "config/constants": typeof config_constants;
  "config/index": typeof config_index;
  crons: typeof crons;
  gameProgress: typeof gameProgress;
  "lib/gameProgressRules": typeof lib_gameProgressRules;
  "lib/scoreRules": typeof lib_scoreRules;
  "lib/userRules": typeof lib_userRules;
  "model/backendRuleFixtures": typeof model_backendRuleFixtures;
  "model/gameProgressTypes": typeof model_gameProgressTypes;
  "model/scoreTypes": typeof model_scoreTypes;
  "model/userTypes": typeof model_userTypes;
  scores: typeof scores;
  users: typeof users;
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
