import type { ReactNode } from "react";

import { Badge } from "@/shared/ui";

type HomeBootstrapStatusShellProps = {
	badgeLabel: string;
	children: ReactNode;
	description: string;
	icon: ReactNode;
	title: string;
};

export function HomeBootstrapStatusShell({
	badgeLabel,
	children,
	description,
	icon,
	title,
}: HomeBootstrapStatusShellProps) {
	return (
		<section
			aria-label="Session status"
			aria-live="polite"
			className="mx-auto w-full max-w-xl rounded-xl bg-background/15 px-4 py-4 text-center sm:px-5"
		>
			<div className="flex flex-col items-center gap-3">
				<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-dungeon-gold/10 text-dungeon-gold">
					{icon}
				</div>
				<div className="min-w-0 space-y-1.5">
					<div className="flex flex-wrap items-center justify-center gap-2">
						<Badge
							variant="outline"
							className="border-dungeon-gold/30 text-dungeon-gold"
						>
							{badgeLabel}
						</Badge>
						<p className="text-sm font-semibold text-panel-title">{title}</p>
					</div>
					<p className="text-sm leading-6 text-panel-body">{description}</p>
					{children}
				</div>
			</div>
		</section>
	);
}
