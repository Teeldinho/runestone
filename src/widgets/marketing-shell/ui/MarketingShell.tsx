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
		<div className="marketing-theme relative min-h-dvh overflow-x-clip bg-background text-foreground">
			<div
				aria-hidden="true"
				className={MARKETING_LAYOUT_CLASS_NAMES.SHELL_BACKGROUND}
			>
				<div className="absolute -top-32 right-[8%] size-[28rem] rounded-full bg-dungeon-gold/10 blur-3xl" />
				<div className="absolute top-[32rem] -left-48 size-[32rem] rounded-full bg-dungeon-rune/5 blur-3xl" />
				<div className="absolute inset-0 bg-[url('/marketing/hex-grid.svg')] bg-[size:120px_104px] opacity-[0.035]" />
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/25 to-background/80" />
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
