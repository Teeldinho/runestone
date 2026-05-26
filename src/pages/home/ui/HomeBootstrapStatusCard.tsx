import { AUTH_STATUS, type AuthStatus } from "@/features/auth";

import { HomeBootstrapAuthenticatedStatusCard } from "./HomeBootstrapAuthenticatedStatusCard";
import { HomeBootstrapCheckingStatusCard } from "./HomeBootstrapCheckingStatusCard";
import { HomeBootstrapFailedStatusCard } from "./HomeBootstrapFailedStatusCard";
import { HomeBootstrapUsernameStatusCard } from "./HomeBootstrapUsernameStatusCard";

type HomeBootstrapStatusCardProps = {
	authStatus: AuthStatus;
	errorMessage: string | null;
	onRetry: () => void;
	readyStatusLabel: string | null;
};

export function HomeBootstrapStatusCard({
	authStatus,
	errorMessage,
	onRetry,
	readyStatusLabel,
}: HomeBootstrapStatusCardProps) {
	if (authStatus === AUTH_STATUS.CHECKING_SESSION) {
		return <HomeBootstrapCheckingStatusCard />;
	}

	if (authStatus === AUTH_STATUS.BOOTSTRAP_FAILED) {
		return (
			<HomeBootstrapFailedStatusCard
				errorMessage={errorMessage}
				onRetry={onRetry}
			/>
		);
	}

	if (authStatus === AUTH_STATUS.AUTHENTICATED) {
		return (
			<HomeBootstrapAuthenticatedStatusCard
				readyStatusLabel={readyStatusLabel}
			/>
		);
	}

	const isSubmittingUsername = authStatus === AUTH_STATUS.SUBMITTING_USERNAME;

	return (
		<HomeBootstrapUsernameStatusCard
			isSubmittingUsername={isSubmittingUsername}
		/>
	);
}
