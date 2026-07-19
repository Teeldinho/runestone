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
		<header
			className={cn(
				"sticky top-0 z-40 pt-3",
				MARKETING_LAYOUT_CLASS_NAMES.CONTENT_GUTTER,
			)}
		>
			<div
				className={cn(
					"mx-auto flex h-16 w-full items-center justify-between gap-4 rounded-2xl border border-panel-border bg-panel/90 px-4 shadow-xl backdrop-blur-xl sm:px-5",
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
						<a
							key={item.id}
							href={item.href}
							aria-current={item.isActive ? "page" : undefined}
							className={cn(
								"inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold transition-colors",
								item.isActive
									? "bg-dungeon-rune/10 text-dungeon-rune"
									: "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
							)}
						>
							{item.label}
						</a>
					))}
				</nav>

				<div className="flex items-center gap-2 sm:gap-3">
					{isAuthenticated ? (
						<Button
							asChild
							size="lg"
							variant="dungeon-gold"
							className="hidden min-h-11 px-4 sm:inline-flex"
						>
							<Link to={MARKETING_ROUTES.GAME} data-entry-trigger>
								<DoorOpen className="size-4" />
								{MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL}
							</Link>
						</Button>
					) : (
						<Button
							type="button"
							data-entry-trigger
							size="lg"
							variant="dungeon-gold"
							className="hidden min-h-11 px-4 sm:inline-flex"
							onClick={onEntryRequest}
						>
							<DoorOpen className="size-4" />
							{MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL}
						</Button>
					)}

					{isAuthenticated ? (
						<Button
							asChild
							size="icon"
							variant="dungeon-gold"
							className="size-11 sm:hidden"
						>
							<Link
								to={MARKETING_ROUTES.GAME}
								data-entry-trigger
								aria-label={MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL}
							>
								<DoorOpen className="size-4" />
							</Link>
						</Button>
					) : (
						<Button
							type="button"
							data-entry-trigger
							size="icon"
							variant="dungeon-gold"
							className="size-11 sm:hidden"
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
