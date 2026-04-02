import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import {
	handleUserProfileByUuidCreateOrGet,
	handleUserProfileByUuidGet,
} from "./api/usersApi";

export const getUserProfileByUuid = query({
	args: {
		uuid: v.string(),
	},
	handler: handleUserProfileByUuidGet,
});

export const createOrGetUserProfileByUuid = mutation({
	args: {
		uuid: v.string(),
		username: v.string(),
	},
	handler: handleUserProfileByUuidCreateOrGet,
});
