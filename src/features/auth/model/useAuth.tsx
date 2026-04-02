import { useQuery } from "@tanstack/react-query";
import { useMachine } from "@xstate/react";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { v4 as createUuid } from "uuid";

import { userQueries } from "@/entities/user";

import { useCreateUser } from "../api";
import { AUTH_ERROR_MESSAGES, AUTH_EVENTS, AUTH_STATUS } from "../config";
import {
	ensureSessionUuid,
	formatUserDisplayTag,
	normalizeUsernameInput,
	writePersistedUsername,
} from "../lib";

import { authMachine } from "./authMachine";
import type { AuthContextValue, UsernameFormInput } from "./types";

const AuthContext = createContext<AuthContextValue | null>(null);

const getClientStorage = (): Storage | null => {
	if (typeof window === "undefined") {
		return null;
	}

	return window.localStorage;
};

const getErrorMessage = (error: unknown): string =>
	error instanceof Error && error.message.length > 0
		? error.message
		: AUTH_ERROR_MESSAGES.USERNAME_SUBMIT_FAILED;

export const useAuth = (): AuthContextValue => {
	const [snapshot, sendAuthEvent] = useMachine(authMachine);
	const [sessionUuid, setSessionUuid] = useState<string | null>(null);
	const createUserMutation = useCreateUser();

	useEffect(() => {
		const storage = getClientStorage();

		if (!storage) {
			return;
		}

		setSessionUuid(ensureSessionUuid(storage, createUuid));
	}, []);

	const profileQuery = useQuery({
		...userQueries.byUuid(sessionUuid ?? ""),
		enabled: Boolean(sessionUuid),
	});

	useEffect(() => {
		if (!sessionUuid || profileQuery.isPending) {
			return;
		}

		sendAuthEvent({
			type: AUTH_EVENTS.SESSION_BOOTSTRAPPED,
			uuid: sessionUuid,
			profile: profileQuery.data ?? null,
		});
	}, [sessionUuid, profileQuery.isPending, profileQuery.data, sendAuthEvent]);

	const handleUsernameFormSubmit = useCallback(
		async ({ username }: UsernameFormInput) => {
			if (!sessionUuid) {
				return;
			}

			const normalizedUsername = normalizeUsernameInput(username);
			sendAuthEvent({
				type: AUTH_EVENTS.USERNAME_SUBMIT_REQUESTED,
				username: normalizedUsername,
			});

			try {
				const profile = await createUserMutation.mutateAsync({
					uuid: sessionUuid,
					username: normalizedUsername,
				});

				const storage = getClientStorage();

				if (storage) {
					writePersistedUsername(storage, profile.username);
				}

				sendAuthEvent({
					type: AUTH_EVENTS.USERNAME_SUBMIT_SUCCEEDED,
					profile,
				});
			} catch (error) {
				sendAuthEvent({
					type: AUTH_EVENTS.USERNAME_SUBMIT_FAILED,
					errorMessage: getErrorMessage(error),
				});
			}
		},
		[createUserMutation, sendAuthEvent, sessionUuid],
	);

	return useMemo(() => {
		const isCheckingSession = snapshot.matches(AUTH_STATUS.CHECKING_SESSION);
		const isAuthenticated = snapshot.matches(AUTH_STATUS.AUTHENTICATED);
		const isUsernameSubmitting = snapshot.matches(
			AUTH_STATUS.SUBMITTING_USERNAME,
		);

		return {
			authStatus: snapshot.value as AuthContextValue["authStatus"],
			authenticatedProfile: snapshot.context.profile,
			errorMessage: snapshot.context.errorMessage,
			isCheckingSession,
			isAuthenticated,
			isUsernameModalOpen:
				snapshot.matches(AUTH_STATUS.REQUIRES_USERNAME) || isUsernameSubmitting,
			isUsernameSubmitting,
			readyStatusLabel: snapshot.context.profile
				? formatUserDisplayTag(
						snapshot.context.profile.username,
						snapshot.context.profile.discriminator,
					)
				: null,
			handleUsernameFormSubmit,
		};
	}, [snapshot, handleUsernameFormSubmit]);
};

type AuthProviderProps = {
	children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
	const authValue = useAuth();

	return (
		<AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
	);
}

export const useAuthContext = (): AuthContextValue => {
	const authContext = useContext(AuthContext);

	if (!authContext) {
		throw new Error(AUTH_ERROR_MESSAGES.MISSING_CONTEXT);
	}

	return authContext;
};
