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
import { AUTH_ERROR_MESSAGES } from "../config";
import {
	createAuthContextValue,
	ensureSessionUuid,
	getAuthClientStorage,
	resolveSessionBootstrapEvent,
	submitAuthUsername,
} from "../lib";

import { authMachine } from "./authMachine";
import type { AuthContextValue, UsernameFormInput } from "./types";

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
	const [snapshot, sendAuthEvent] = useMachine(authMachine);
	const [sessionUuid, setSessionUuid] = useState<string | null>(null);
	const createUserMutation = useCreateUser();

	useEffect(() => {
		const storage = getAuthClientStorage();

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
		const sessionBootstrapEvent = resolveSessionBootstrapEvent({
			sessionUuid,
			isProfileQueryPending: profileQuery.isPending,
			profile: profileQuery.data,
		});

		if (!sessionBootstrapEvent) {
			return;
		}

		sendAuthEvent(sessionBootstrapEvent);
	}, [sessionUuid, profileQuery.isPending, profileQuery.data, sendAuthEvent]);

	const handleUsernameFormSubmit = useCallback(
		async ({ username }: UsernameFormInput) => {
			await submitAuthUsername({
				username,
				sessionUuid,
				createUser: createUserMutation.mutateAsync,
				storage: getAuthClientStorage(),
				sendAuthEvent,
			});
		},
		[createUserMutation, sendAuthEvent, sessionUuid],
	);

	return useMemo(
		() =>
			createAuthContextValue({
				snapshot,
				handleUsernameFormSubmit,
			}),
		[snapshot, handleUsernameFormSubmit],
	);
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
