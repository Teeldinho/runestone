import { Link } from "@tanstack/react-router";
import { DoorOpen } from "lucide-react";

import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";

import { MARKETING_ROUTES, MARKETING_SHELL_COPY } from "../config";
import type { MarketingNavigationViewModel } from "../lib";
import { MarketingNavigationDrawer } from "./MarketingNavigationDrawer";
import { RunestoneLogo } from "./RunestoneLogo";

type MarketingHeaderProps = {
	isAuthenticated: boolean;
	viewModel: MarketingNavigationViewModel;
};

export function MarketingHeader({
	isAuthenticated,
	viewModel,
}: MarketingHeaderProps) {
	return (
		<header className="sticky top-0 z-40 border-panel-border/70 border-b bg-background/80 backdrop-blur-xl">
			<div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
				<div className="hidden lg:block">
					<RunestoneLogo variant="desktop" />
				</div>
				<div className="lg:hidden">
					<RunestoneLogo variant="compact" />
				</div>

				<nav
					aria-label="Main navigation"
					className="hidden items-center gap-2 lg:flex"
				>
					{viewModel.navigationItems.map((item) => (
						<Link
							key={item.id}
							to={item.to}
							className={cn(
								"rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
								item.isActive
									? "bg-primary/10 text-primary"
									: "text-panel-body hover:bg-muted/60 hover:text-panel-title",
							)}
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-2">
					{isAuthenticated ? (
						<Button asChild size="lg" className="hidden sm:inline-flex">
							<Link to={MARKETING_ROUTES.GAME}>
								<DoorOpen className="size-4" />
								{MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL}
							</Link>
						</Button>
					) : (
						<Button disabled size="lg" className="hidden sm:inline-flex">
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
							disabled
							size="icon"
							className="sm:hidden"
							aria-label={MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL}
						>
							<DoorOpen className="size-4" />
						</Button>
					)}

					<MarketingNavigationDrawer
						isAuthenticated={isAuthenticated}
						viewModel={viewModel}
					/>
				</div>
			</div>
		</header>
	);
}
