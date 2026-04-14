import type { ReactNode } from "react";

type DesktopGameLayoutProps = {
	leftPane: ReactNode;
	centerPane: ReactNode;
	rightPane: ReactNode;
};

export function DesktopGameLayout({
	leftPane,
	centerPane,
	rightPane,
}: DesktopGameLayoutProps) {
	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
			<aside
				aria-label="Statechart graph"
				className="order-2 flex w-full shrink-0 flex-col border-t lg:order-1 lg:w-[var(--game-left-pane-width)] lg:border-r lg:border-t-0"
			>
				{leftPane}
			</aside>

			<div className="order-1 flex min-h-0 min-w-0 flex-1 flex-col lg:order-2 lg:overflow-hidden">
				{centerPane}
			</div>

			<aside
				aria-label="Game controls and state"
				className="order-3 flex w-full shrink-0 flex-col border-t lg:w-[var(--game-right-pane-width)] lg:border-l lg:border-t-0"
			>
				{rightPane}
			</aside>
		</div>
	);
}
