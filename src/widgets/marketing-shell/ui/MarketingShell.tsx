import type { ReactNode } from "react";

import type { MarketingNavigationItemId } from "../config";
import { MARKETING_LAYOUT_CLASS_NAMES } from "../config";
import { useMarketingNavigation } from "../model";
import { MarketingFooter } from "./MarketingFooter";
import { MarketingHeader } from "./MarketingHeader";

type MarketingShellProps = {
	activeNavigationItemId: MarketingNavigationItemId | null;
	children: ReactNode;
	isAuthenticated: boolean;
	onEntryRequest: () => void;
};

export function MarketingShell({
	activeNavigationItemId,
	children,
	isAuthenticated,
	onEntryRequest,
}: MarketingShellProps) {
	const viewModel = useMarketingNavigation(activeNavigationItemId);

	return (
		<div className="relative min-h-dvh overflow-x-hidden bg-background text-foreground">
			<div
				aria-hidden="true"
				className={MARKETING_LAYOUT_CLASS_NAMES.SHELL_BACKGROUND}
			>
				<div className={MARKETING_LAYOUT_CLASS_NAMES.SHELL_GLOW_PRIMARY} />
				<div className={MARKETING_LAYOUT_CLASS_NAMES.SHELL_GLOW_ACCENT} />
				<div className={MARKETING_LAYOUT_CLASS_NAMES.SHELL_GRID} />
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,var(--background)_100%)]"
				/>
				<div className={MARKETING_LAYOUT_CLASS_NAMES.SHELL_EDGE_FADE} />
			</div>
			<div className="relative flex min-h-dvh flex-col">
				<MarketingHeader
					isAuthenticated={isAuthenticated}
					onEntryRequest={onEntryRequest}
					viewModel={viewModel}
				/>
				<main id="main-content" className="relative z-10 flex-1">
					{children}
				</main>
				<MarketingFooter viewModel={viewModel} />
			</div>
		</div>
	);
}
