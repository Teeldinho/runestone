import type { UserProfile } from "@/entities/user";

import { AUTH_ERROR_MESSAGES, AUTH_EVENTS } from "../config";
import { normalizeUsernameInput } from "./discriminator";
import { writePersistedUsername } from "./sessionStorage";

type SessionBootstrapEvent = {
	type: (typeof AUTH_EVENTS)["SESSION_BOOTSTRAPPED"];
	uuid: string;
	profile: UserProfile | null;
};

type SessionBootstrapFailureEvent = {
	type: (typeof AUTH_EVENTS)["SESSION_BOOTSTRAP_FAILED"];
	uuid: string;
	errorMessage: string;
};

type SessionBootstrapInput = {
	sessionUuid: string | null;
	isProfileQueryPending: boolean;
	profile: UserProfile | null | undefined;
};

type SessionBootstrapFailureInput = {
	sessionUuid: string | null;
	isProfileQueryPending: boolean;
	isProfileQueryError: boolean;
	hasSessionBootstrapTimedOut: boolean;
	profile: UserProfile | null | undefined;
	error: unknown;
};

type SubmitAuthUsernameEvent =
	| {
			type: (typeof AUTH_EVENTS)["USERNAME_SUBMIT_REQUESTED"];
			username: string;
	  }
	| {
			type: (typeof AUTH_EVENTS)["USERNAME_SUBMIT_SUCCEEDED"];
			profile: UserProfile;
	  }
	| {
			type: (typeof AUTH_EVENTS)["USERNAME_SUBMIT_FAILED"];
			errorMessage: string;
	  };

type SubmitAuthUsernameInput = {
	username: string;
	sessionUuid: string | null;
	createUser: (input: {
		uuid: string;
		username: string;
	}) => Promise<UserProfile>;
	storage: Storage | null;
	sendAuthEvent: (event: SubmitAuthUsernameEvent) => void;
};

const getAuthClientStorage = (): Storage | null => {
	if (typeof window === "undefined") {
		return null;
	}

	return window.localStorage;
};

const resolveAuthSubmitErrorMessage = (error: unknown): string =>
	error instanceof Error && error.message.length > 0
		? error.message
		: AUTH_ERROR_MESSAGES.USERNAME_SUBMIT_FAILED;

const resolveSessionBootstrapErrorMessage = (error: unknown): string =>
	error instanceof Error && error.message.length > 0
		? error.message
		: AUTH_ERROR_MESSAGES.SESSION_BOOTSTRAP_FAILED;

const resolveSessionBootstrapEvent = ({
	sessionUuid,
	isProfileQueryPending,
	profile,
}: SessionBootstrapInput): SessionBootstrapEvent | null => {
	if (!sessionUuid || isProfileQueryPending) {
		return null;
	}

	return {
		type: AUTH_EVENTS.SESSION_BOOTSTRAPPED,
		uuid: sessionUuid,
		profile: profile ?? null,
	};
};

const resolveSessionBootstrapFailureEvent = ({
	sessionUuid,
	isProfileQueryPending,
	isProfileQueryError,
	hasSessionBootstrapTimedOut,
	profile,
	error,
}: SessionBootstrapFailureInput): SessionBootstrapFailureEvent | null => {
	if (
		!sessionUuid ||
		profile ||
		(!isProfileQueryError && !hasSessionBootstrapTimedOut) ||
		(isProfileQueryPending && !hasSessionBootstrapTimedOut)
	) {
		return null;
	}

	return {
		type: AUTH_EVENTS.SESSION_BOOTSTRAP_FAILED,
		uuid: sessionUuid,
		errorMessage: hasSessionBootstrapTimedOut
			? AUTH_ERROR_MESSAGES.SESSION_BOOTSTRAP_TIMED_OUT
			: resolveSessionBootstrapErrorMessage(error),
	};
};

const submitAuthUsername = async ({
	username,
	sessionUuid,
	createUser,
	storage,
	sendAuthEvent,
}: SubmitAuthUsernameInput): Promise<UserProfile | null> => {
	if (!sessionUuid) {
		return null;
	}

	const normalizedUsername = normalizeUsernameInput(username);

	sendAuthEvent({
		type: AUTH_EVENTS.USERNAME_SUBMIT_REQUESTED,
		username: normalizedUsername,
	});

	try {
		const profile = await createUser({
			uuid: sessionUuid,
			username: normalizedUsername,
		});

		if (storage) {
			writePersistedUsername(storage, profile.username);
		}

		sendAuthEvent({
			type: AUTH_EVENTS.USERNAME_SUBMIT_SUCCEEDED,
			profile,
		});

		return profile;
	} catch (error) {
		sendAuthEvent({
			type: AUTH_EVENTS.USERNAME_SUBMIT_FAILED,
			errorMessage: resolveAuthSubmitErrorMessage(error),
		});

		return null;
	}
};

export type {
	SessionBootstrapEvent,
	SessionBootstrapFailureEvent,
	SessionBootstrapFailureInput,
	SessionBootstrapInput,
	SubmitAuthUsernameEvent,
	SubmitAuthUsernameInput,
};
export {
	getAuthClientStorage,
	resolveAuthSubmitErrorMessage,
	resolveSessionBootstrapErrorMessage,
	resolveSessionBootstrapEvent,
	resolveSessionBootstrapFailureEvent,
	submitAuthUsername,
};
