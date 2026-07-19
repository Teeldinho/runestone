import { Link } from "@tanstack/react-router";
import { DoorOpen } from "lucide-react";

import { AUTH_STATUS } from "@/features/auth";
import { Button } from "@/shared/ui";
import { MARKETING_ROUTES } from "@/widgets/marketing-shell";

import { HOME_COPY } from "../config";
import type { HomePageViewModel } from "../lib";

type HomeEntryActionProps = HomePageViewModel["entryProps"] & {
	label: string;
};

export function HomeEntryAction({
	authStatus,
	errorMessage,
	isAuthenticated,
	label,
	onEntryRequest,
	onRetry,
	readyStatusLabel,
}: HomeEntryActionProps) {
	if (isAuthenticated) {
		return (
			<div className="w-full space-y-2 sm:w-auto">
				<Button
					asChild
					size="lg"
					variant="dungeon-gold"
					className="min-h-11 w-full px-5 sm:w-auto"
				>
					<Link to={MARKETING_ROUTES.GAME} data-entry-trigger>
						<DoorOpen aria-hidden="true" />
						{label}
					</Link>
				</Button>
				{readyStatusLabel ? (
					<p className="font-mono text-xs text-muted-foreground">
						Playing as {readyStatusLabel}
					</p>
				) : null}
			</div>
		);
	}

	if (authStatus === AUTH_STATUS.BOOTSTRAP_FAILED) {
		return (
			<div className="w-full space-y-2 sm:w-auto">
				<Button
					type="button"
					size="lg"
					variant="dungeon-gold"
					className="min-h-11 w-full px-5 sm:w-auto"
					onClick={onRetry}
				>
					{HOME_COPY.RETRY_LABEL}
				</Button>
				<p role="alert" className="max-w-sm text-sm text-destructive">
					{errorMessage ?? "Entry is temporarily unavailable."}
				</p>
			</div>
		);
	}

	return (
		<Button
			type="button"
			data-entry-trigger
			size="lg"
			variant="dungeon-gold"
			className="min-h-11 w-full px-5 sm:w-auto"
			onClick={onEntryRequest}
		>
			<DoorOpen aria-hidden="true" />
			{label}
		</Button>
	);
}
