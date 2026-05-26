import { LoaderCircle } from "lucide-react";

import { Skeleton } from "@/shared/ui";

import { HOME_STATUS_COPY } from "../config";

import { HomeBootstrapStatusShell } from "./HomeBootstrapStatusShell";

export function HomeBootstrapCheckingStatusCard() {
	return (
		<HomeBootstrapStatusShell
			badgeLabel={HOME_STATUS_COPY.CHECKING_SESSION.badge}
			description={HOME_STATUS_COPY.CHECKING_SESSION.description}
			icon={<LoaderCircle className="size-4 animate-spin" />}
			title={HOME_STATUS_COPY.CHECKING_SESSION.title}
		>
			<div className="space-y-2 pt-1">
				<Skeleton className="h-3.5 w-4/5 bg-dungeon-gold/10" />
				<p className="text-xs leading-5 text-muted-foreground">
					{HOME_STATUS_COPY.CHECKING_SESSION.detail}
				</p>
			</div>
		</HomeBootstrapStatusShell>
	);
}
