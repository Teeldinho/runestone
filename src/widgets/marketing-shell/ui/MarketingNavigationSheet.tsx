import { Link } from "@tanstack/react-router";
import { DoorOpen, Github, Menu } from "lucide-react";

import { cn } from "@/shared/lib";
import {
	Button,
	Separator,
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/ui";

import {
	MARKETING_ROUTES,
	MARKETING_SHELL_COPY,
	RUNESTONE_LOGO_VARIANTS,
} from "../config";
import type { MarketingNavigationViewModel } from "../lib";
import { useMarketingNavigationSheet } from "../model";
import { RunestoneLogo } from "./RunestoneLogo";

type MarketingNavigationSheetProps = {
	isAuthenticated: boolean;
	onEntryRequest: () => void;
	viewModel: MarketingNavigationViewModel;
};

export function MarketingNavigationSheet({
	isAuthenticated,
	onEntryRequest,
	viewModel,
}: MarketingNavigationSheetProps) {
	const { handleAnchorNavigation } = useMarketingNavigationSheet();

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					type="button"
					variant="dungeon-outline"
					size="icon"
					aria-label={MARKETING_SHELL_COPY.OPEN_NAVIGATION_LABEL}
					className="size-11 lg:hidden"
				>
					<Menu className="size-4" />
				</Button>
			</SheetTrigger>

			<SheetContent
				side="left"
				className="marketing-theme flex h-dvh w-screen max-w-none flex-col gap-0 overflow-hidden border-panel-border bg-background p-0 text-foreground data-[side=left]:w-screen data-[side=left]:max-w-none data-[side=left]:sm:max-w-none"
			>
				<div className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col px-4 py-4 sm:px-6">
					<div className="flex items-start justify-between gap-4">
						<RunestoneLogo variant={RUNESTONE_LOGO_VARIANTS.COMPACT} />
					</div>

					<SheetHeader className="p-0 pt-6 text-left">
						<SheetTitle>
							{MARKETING_SHELL_COPY.NAVIGATION_SHEET_TITLE}
						</SheetTitle>
						<SheetDescription>
							{MARKETING_SHELL_COPY.NAVIGATION_SHEET_DESCRIPTION}
						</SheetDescription>
					</SheetHeader>

					<Separator className="my-4 bg-panel-border" />

					<div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain pb-4 pr-1">
						<nav aria-label="Mobile navigation" className="flex-1">
							<ul className="grid gap-1.5">
								{viewModel.navigationItems.map((item) => (
									<li key={item.id}>
										<SheetClose asChild>
											<a
												href={item.href}
												aria-current={item.isActive ? "page" : undefined}
												onClick={handleAnchorNavigation}
												className={cn(
													"flex min-h-11 items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold transition-colors",
													item.isActive
														? "bg-dungeon-rune/10 text-dungeon-rune"
														: "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
												)}
											>
												{item.label}
											</a>
										</SheetClose>
									</li>
								))}

								<li>
									<SheetClose asChild>
										<a
											href={MARKETING_ROUTES.GITHUB_REPOSITORY}
											target="_blank"
											rel="noreferrer"
											className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
										>
											<Github className="size-4" />
											{MARKETING_SHELL_COPY.GITHUB_LABEL}
										</a>
									</SheetClose>
								</li>
							</ul>
						</nav>

						<SheetFooter className="mt-5 p-0">
							{isAuthenticated ? (
								<SheetClose asChild>
									<Button
										asChild
										variant="dungeon-gold"
										className="min-h-11 w-full"
									>
										<Link to={MARKETING_ROUTES.GAME} data-entry-trigger>
											<DoorOpen className="size-4" />
											{MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL}
										</Link>
									</Button>
								</SheetClose>
							) : (
								<SheetClose asChild>
									<Button
										type="button"
										data-entry-trigger
										variant="dungeon-gold"
										className="min-h-11 w-full"
										onClick={onEntryRequest}
									>
										<DoorOpen className="size-4" />
										{MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL}
									</Button>
								</SheetClose>
							)}
						</SheetFooter>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
