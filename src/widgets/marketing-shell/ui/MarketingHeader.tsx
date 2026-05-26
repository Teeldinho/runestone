import { Link } from "@tanstack/react-router";
import { DoorOpen } from "lucide-react";

import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";

import {
	MARKETING_LAYOUT_CLASS_NAMES,
	MARKETING_ROUTES,
	MARKETING_SHELL_COPY,
	RUNESTONE_LOGO_VARIANTS,
} from "../config";
import type { MarketingNavigationViewModel } from "../lib";
import { MarketingNavigationSheet } from "./MarketingNavigationSheet";
import { RunestoneLogo } from "./RunestoneLogo";

type MarketingHeaderProps = {
	isAuthenticated: boolean;
	onEntryRequest: () => void;
	viewModel: MarketingNavigationViewModel;
};

export function MarketingHeader({
	isAuthenticated,
	onEntryRequest,
	viewModel,
}: MarketingHeaderProps) {
	return (
		<header className="sticky top-0 z-40 border-panel-border/70 border-b bg-background/80 backdrop-blur-xl">
			<div
				className={cn(
					"mx-auto flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8",
					MARKETING_LAYOUT_CLASS_NAMES.CONTENT_WIDTH,
				)}
			>
				<div className="hidden lg:block">
					<RunestoneLogo variant={RUNESTONE_LOGO_VARIANTS.DESKTOP} />
				</div>
				<div className="lg:hidden">
					<RunestoneLogo variant={RUNESTONE_LOGO_VARIANTS.COMPACT} />
				</div>

				<nav
					aria-label="Main navigation"
					className="hidden items-center gap-2 lg:flex"
				>
					{viewModel.navigationItems.map((item) => (
						<Link
							key={item.id}
							to={item.to}
							aria-current={item.isActive ? "page" : undefined}
							className={cn(
								"rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
								item.isActive
									? "bg-dungeon-gold/10 text-dungeon-gold"
									: "text-panel-body hover:bg-muted/60 hover:text-panel-title",
							)}
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-2 sm:gap-3">
					{isAuthenticated ? (
						<Button asChild size="lg" className="hidden sm:inline-flex">
							<Link to={MARKETING_ROUTES.GAME}>
								<DoorOpen className="size-4" />
								{MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL}
							</Link>
						</Button>
					) : (
						<Button
							type="button"
							size="lg"
							className="hidden sm:inline-flex"
							onClick={onEntryRequest}
						>
							<DoorOpen className="size-4" />
							{MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL}
						</Button>
					)}

					{isAuthenticated ? (
						<Button asChild size="icon" className="sm:hidden">
							<Link
								to={MARKETING_ROUTES.GAME}
								aria-label={MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL}
							>
								<DoorOpen className="size-4" />
							</Link>
						</Button>
					) : (
						<Button
							type="button"
							size="icon"
							className="sm:hidden"
							aria-label={MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL}
							onClick={onEntryRequest}
						>
							<DoorOpen className="size-4" />
						</Button>
					)}

					<MarketingNavigationSheet
						isAuthenticated={isAuthenticated}
						onEntryRequest={onEntryRequest}
						viewModel={viewModel}
					/>
				</div>
			</div>
		</header>
	);
}
