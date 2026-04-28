import { useCallback } from "react";

import { useCreateUser } from "../api";
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

	return { handleUsernameFormSubmit };
};
