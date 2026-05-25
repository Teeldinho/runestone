import type { ReactNode } from "react";

import type { MarketingNavigationItemId } from "../config";
import { useMarketingNavigation } from "../model";
import { MarketingFooter } from "./MarketingFooter";
import { MarketingHeader } from "./MarketingHeader";

type MarketingShellProps = {
	activeNavigationItemId: MarketingNavigationItemId | null;
	children: ReactNode;
	isAuthenticated: boolean;
};

export function MarketingShell({
	activeNavigationItemId,
	children,
	isAuthenticated,
}: MarketingShellProps) {
	const viewModel = useMarketingNavigation(activeNavigationItemId);

	return (
		<div className="relative h-dvh overflow-y-auto overscroll-contain bg-background text-foreground">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 overflow-hidden"
			>
				<div className="absolute -left-24 -top-24 size-96 rounded-full bg-primary/10 blur-3xl" />
				<div className="absolute right-[-6rem] top-16 size-96 rounded-full bg-accent/10 blur-3xl" />
				<div className="absolute inset-0 bg-[linear-gradient(135deg,var(--panel-border)_0_1px,transparent_1px_100%)] bg-[length:34px_34px] opacity-40" />
			</div>
			<div className="relative min-h-full">
				<MarketingHeader
					isAuthenticated={isAuthenticated}
					viewModel={viewModel}
				/>
				<main id="main-content">{children}</main>
				<MarketingFooter viewModel={viewModel} />
			</div>
		</div>
	);
}
