import type { UserProfile } from "@/entities/user";

import { AUTH_STATUS } from "../config";
import type { AuthContextValue } from "../model/types";
import { formatUserDisplayTag } from "./discriminator";

type AuthStatusValue = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];

type AuthSnapshotLike = {
	value: unknown;
	context: {
		profile: UserProfile | null;
		errorMessage: string | null;
	};
	matches: (status: AuthStatusValue) => boolean;
};

type CreateAuthContextValueInput = {
	snapshot: AuthSnapshotLike;
	suggestedUsername: string;
	handleSessionBootstrapRetry: AuthContextValue["handleSessionBootstrapRetry"];
	handleUsernameFormSubmit: AuthContextValue["handleUsernameFormSubmit"];
};

const createAuthContextValue = ({
	snapshot,
	suggestedUsername,
	handleSessionBootstrapRetry,
	handleUsernameFormSubmit,
}: CreateAuthContextValueInput): AuthContextValue => {
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
		suggestedUsername,
		handleSessionBootstrapRetry,
		handleUsernameFormSubmit,
	};
};

export type { AuthSnapshotLike, CreateAuthContextValueInput };
export { createAuthContextValue };
