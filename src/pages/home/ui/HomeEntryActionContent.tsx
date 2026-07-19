import { Link } from "@tanstack/react-router";
import { DoorOpen } from "lucide-react";

import { AUTH_STATUS } from "@/features/auth";
import { Button } from "@/shared/ui";
import { MARKETING_ROUTES } from "@/widgets/marketing-shell";

import { HOME_COPY, HOME_ENTRY_ACTION_CLASS_NAMES } from "../config";
import type { HomePageViewModel } from "../lib";

type HomeEntryActionContentProps = HomePageViewModel["entryProps"] & {
	label: string;
};

export function HomeEntryActionContent({
	authStatus,
	errorMessage,
	isAuthenticated,
	label,
	onEntryRequest,
	onRetry,
	readyStatusLabel,
}: HomeEntryActionContentProps) {
	if (isAuthenticated) {
		return (
			<div className={HOME_ENTRY_ACTION_CLASS_NAMES.ROOT}>
				<Button
					asChild
					size="lg"
					variant="dungeon-gold"
					className={HOME_ENTRY_ACTION_CLASS_NAMES.BUTTON}
				>
					<Link to={MARKETING_ROUTES.GAME} data-entry-trigger>
						<DoorOpen aria-hidden="true" />
						{label}
					</Link>
				</Button>
				{readyStatusLabel ? (
					<p className={HOME_ENTRY_ACTION_CLASS_NAMES.STATUS}>
						Playing as {readyStatusLabel}
					</p>
				) : null}
			</div>
		);
	}

	if (authStatus === AUTH_STATUS.BOOTSTRAP_FAILED) {
		return (
			<div className={HOME_ENTRY_ACTION_CLASS_NAMES.ROOT}>
				<Button
					type="button"
					size="lg"
					variant="dungeon-gold"
					className={HOME_ENTRY_ACTION_CLASS_NAMES.BUTTON}
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
		<div className={HOME_ENTRY_ACTION_CLASS_NAMES.ROOT}>
			<Button
				type="button"
				data-entry-trigger
				size="lg"
				variant="dungeon-gold"
				className={HOME_ENTRY_ACTION_CLASS_NAMES.BUTTON}
				onClick={onEntryRequest}
			>
				<DoorOpen aria-hidden="true" />
				{label}
			</Button>
		</div>
	);
}

export type { HomeEntryActionContentProps };
