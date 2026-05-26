export const AUTH_INITIAL_CONTEXT = {
	uuid: "",
	profile: null,
	pendingUsername: null,
	errorMessage: null,
	isUsernameEntryRequested: false,
	isUsernameEntryDeferred: false,
};

export const AUTH_CONTEXT_KEYS = {
	UUID: "uuid",
	PROFILE: "profile",
	PENDING_USERNAME: "pendingUsername",
	ERROR_MESSAGE: "errorMessage",
	IS_USERNAME_ENTRY_REQUESTED: "isUsernameEntryRequested",
	IS_USERNAME_ENTRY_DEFERRED: "isUsernameEntryDeferred",
} as const;
