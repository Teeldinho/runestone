import { CheckCircle2, ShieldCheck } from "lucide-react";

import { HOME_STATUS_COPY } from "../config";

import { HomeBootstrapStatusShell } from "./HomeBootstrapStatusShell";

type HomeBootstrapAuthenticatedStatusCardProps = {
	readyStatusLabel: string | null;
};

export function HomeBootstrapAuthenticatedStatusCard({
	readyStatusLabel,
}: HomeBootstrapAuthenticatedStatusCardProps) {
	return (
		<HomeBootstrapStatusShell
			badgeLabel={HOME_STATUS_COPY.AUTHENTICATED.badge}
			description={HOME_STATUS_COPY.AUTHENTICATED.description}
			icon={<ShieldCheck className="size-4" />}
			title={HOME_STATUS_COPY.AUTHENTICATED.title}
		>
			<div className="flex flex-wrap items-center justify-center gap-2 text-center text-xs leading-5 text-muted-foreground">
				{readyStatusLabel ? (
					<span className="inline-flex items-center gap-1.5 rounded-full border border-panel-border/80 px-2 py-1">
						<CheckCircle2 className="size-3.5 text-dungeon-gold" />
						{readyStatusLabel}
					</span>
				) : null}
				<span>{HOME_STATUS_COPY.AUTHENTICATED.detail}</span>
			</div>
		</HomeBootstrapStatusShell>
	);
}
