import { useMachine } from "@xstate/react";
import { useMemo } from "react";

import { createAuthContextValue } from "../lib";

import { authMachine } from "./authMachine";
import type { AuthContextValue } from "./types";
import { useAuthSessionBootstrap } from "./useAuthSessionBootstrap";
import { useAuthUsernameSubmission } from "./useAuthUsernameSubmission";

export const useAuth = (): AuthContextValue => {
	const [snapshot, sendAuthEvent] = useMachine(authMachine);
	const { sessionUuid } = useAuthSessionBootstrap({ sendAuthEvent });
	const { handleUsernameFormSubmit } = useAuthUsernameSubmission({
		sendAuthEvent,
		sessionUuid,
	});

	return useMemo(
		() =>
			createAuthContextValue({
				snapshot,
				handleUsernameFormSubmit,
			}),
		[snapshot, handleUsernameFormSubmit],
	);
};
