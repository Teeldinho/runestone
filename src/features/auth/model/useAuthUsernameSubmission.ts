import { useRouter } from "@tanstack/react-router";
import { useCallback } from "react";

import { useCreateUser } from "../api";
import { AUTH_ROUTE_PATHS } from "../config";
import { getAuthClientStorage, submitAuthUsername } from "../lib";

import type { AuthMachineEvent, UsernameFormInput } from "./types";

type UseAuthUsernameSubmissionInput = {
	sendAuthEvent: (event: AuthMachineEvent) => void;
	sessionUuid: string | null;
};

type UseAuthUsernameSubmissionResult = {
	handleUsernameFormSubmit: (input: UsernameFormInput) => Promise<void>;
};

export const useAuthUsernameSubmission = ({
	sendAuthEvent,
	sessionUuid,
}: UseAuthUsernameSubmissionInput): UseAuthUsernameSubmissionResult => {
	const createUserMutation = useCreateUser();
	const router = useRouter();

	const handleUsernameFormSubmit = useCallback(
		async ({ username }: UsernameFormInput) => {
			const profile = await submitAuthUsername({
				username,
				sessionUuid,
				createUser: createUserMutation.mutateAsync,
				storage: getAuthClientStorage(),
				sendAuthEvent,
			});

			if (!profile) {
				return;
			}

			void router
				.preloadRoute({
					to: AUTH_ROUTE_PATHS.GAME,
				})
				.catch(() => undefined);
			await router.navigate({
				to: AUTH_ROUTE_PATHS.GAME,
			});
		},
		[createUserMutation, router, sendAuthEvent, sessionUuid],
	);

	return { handleUsernameFormSubmit };
};
