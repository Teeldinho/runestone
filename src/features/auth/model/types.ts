export type AuthStatus =
	| "checkingSession"
	| "requiresUsername"
	| "authenticated";

export type AuthActorContext = {
	uuid: string;
	username: string | null;
	discriminator: string | null;
	userId: string | null;
};

export type UsernameFormInput = {
	username: string;
};
