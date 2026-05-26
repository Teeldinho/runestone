import { KeyRound, LoaderCircle } from "lucide-react";

import { HOME_STATUS_COPY } from "../config";

import { HomeBootstrapStatusShell } from "./HomeBootstrapStatusShell";

type HomeBootstrapUsernameStatusCardProps = {
	isSubmittingUsername: boolean;
};

export function HomeBootstrapUsernameStatusCard({
	isSubmittingUsername,
}: HomeBootstrapUsernameStatusCardProps) {
	return (
		<HomeBootstrapStatusShell
			badgeLabel={
				isSubmittingUsername
					? HOME_STATUS_COPY.SUBMITTING_USERNAME.badge
					: HOME_STATUS_COPY.REQUIRES_USERNAME.badge
			}
			description={
				isSubmittingUsername
					? HOME_STATUS_COPY.SUBMITTING_USERNAME.description
					: HOME_STATUS_COPY.REQUIRES_USERNAME.description
			}
			icon={
				isSubmittingUsername ? (
					<LoaderCircle className="size-4 animate-spin" />
				) : (
					<KeyRound className="size-4" />
				)
			}
			title={
				isSubmittingUsername
					? HOME_STATUS_COPY.SUBMITTING_USERNAME.title
					: HOME_STATUS_COPY.REQUIRES_USERNAME.title
			}
		>
			<p className="text-xs leading-5 text-muted-foreground">
				{isSubmittingUsername
					? HOME_STATUS_COPY.SUBMITTING_USERNAME.detail
					: HOME_STATUS_COPY.REQUIRES_USERNAME.detail}
			</p>
		</HomeBootstrapStatusShell>
	);
}
