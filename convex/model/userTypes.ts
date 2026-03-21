import type { Doc } from "../_generated/dataModel";

type PersistedUser = Pick<
	Doc<"users">,
	"_id" | "uuid" | "username" | "discriminator" | "createdAt" | "updatedAt"
>;

type UserProfile = {
	id: PersistedUser["_id"];
	uuid: string;
	username: string;
	discriminator: string;
	createdAt: number;
	updatedAt: number;
};

type GetUserProfileByUuidArgs = {
	uuid: string;
};

type CreateOrGetUserProfileByUuidArgs = {
	uuid: string;
	username: string;
};

export type {
	CreateOrGetUserProfileByUuidArgs,
	GetUserProfileByUuidArgs,
	PersistedUser,
	UserProfile,
};
