export const AUTH_INITIAL_CONTEXT = {
	uuid: "",
	profile: null,
	pendingUsername: null,
	errorMessage: null,
};

export const AUTH_CONTEXT_KEYS = {
	UUID: "uuid",
	PROFILE: "profile",
	PENDING_USERNAME: "pendingUsername",
	ERROR_MESSAGE: "errorMessage",
} as const;
