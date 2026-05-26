import { useMachine } from "@xstate/react";
import { useCallback, useMemo } from "react";

import { AUTH_EVENTS } from "../config";
import { createAuthContextValue, createSuggestedUsername } from "../lib";

import { authMachine } from "./authMachine";
import type { AuthContextValue } from "./types";
import { useAuthSessionBootstrap } from "./useAuthSessionBootstrap";
import { useAuthUsernameSubmission } from "./useAuthUsernameSubmission";

export const useAuth = (): AuthContextValue => {
	const [snapshot, sendAuthEvent] = useMachine(authMachine);
	const suggestedUsername = useMemo(() => createSuggestedUsername(), []);
	const { handleSessionBootstrapRetry, sessionUuid } = useAuthSessionBootstrap({
		sendAuthEvent,
	});
	const { handleUsernameFormSubmit } = useAuthUsernameSubmission({
		sendAuthEvent,
		sessionUuid,
	});
	const handleUsernameEntryRequest = useCallback(() => {
		sendAuthEvent({
			type: AUTH_EVENTS.USERNAME_ENTRY_REQUESTED,
		});
	}, [sendAuthEvent]);
	const handleUsernameEntryDismiss = useCallback(() => {
		sendAuthEvent({
			type: AUTH_EVENTS.USERNAME_ENTRY_DEFERRED,
		});
	}, [sendAuthEvent]);

	return useMemo(
		() =>
			createAuthContextValue({
				snapshot,
				suggestedUsername,
				handleSessionBootstrapRetry,
				handleUsernameFormSubmit,
				handleUsernameEntryRequest,
				handleUsernameEntryDismiss,
			}),
		[
			snapshot,
			suggestedUsername,
			handleSessionBootstrapRetry,
			handleUsernameFormSubmit,
			handleUsernameEntryRequest,
			handleUsernameEntryDismiss,
		],
	);
};
