import { useMachine } from "@xstate/react";
import { useMemo } from "react";

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

	return useMemo(
		() =>
			createAuthContextValue({
				snapshot,
				suggestedUsername,
				handleSessionBootstrapRetry,
				handleUsernameFormSubmit,
			}),
		[
			snapshot,
			suggestedUsername,
			handleSessionBootstrapRetry,
			handleUsernameFormSubmit,
		],
	);
};
