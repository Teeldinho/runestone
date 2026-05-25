import { Link } from "@tanstack/react-router";
import { DoorOpen, Github, Menu } from "lucide-react";

import { cn } from "@/shared/lib";
import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	Separator,
} from "@/shared/ui";

import { MARKETING_ROUTES, MARKETING_SHELL_COPY } from "../config";
import type { MarketingNavigationViewModel } from "../lib";

type MarketingNavigationDrawerProps = {
	isAuthenticated: boolean;
	viewModel: MarketingNavigationViewModel;
};

export function MarketingNavigationDrawer({
	isAuthenticated,
	viewModel,
}: MarketingNavigationDrawerProps) {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					type="button"
					variant="dungeon-outline"
					size="icon"
					aria-label="Open navigation"
					className="lg:hidden"
				>
					<Menu className="size-4" />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{MARKETING_SHELL_COPY.DRAWER_TITLE}</DrawerTitle>
					<DrawerDescription>
						{MARKETING_SHELL_COPY.DRAWER_DESCRIPTION}
					</DrawerDescription>
				</DrawerHeader>

				<nav aria-label="Mobile navigation" className="px-4 py-2">
					<div className="grid gap-2">
						{viewModel.navigationItems.map((item) => (
							<DrawerClose key={item.id} asChild>
								<Link
									to={item.to}
									className={cn(
										"rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
										item.isActive
											? "border-primary/60 bg-primary/10 text-primary"
											: "border-panel-border bg-background/40 text-panel-body hover:border-dungeon-gold/50 hover:text-dungeon-gold",
									)}
								>
									{item.label}
								</Link>
							</DrawerClose>
						))}
						<a
							href={MARKETING_ROUTES.GITHUB_REPOSITORY}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-2 rounded-lg border border-panel-border bg-background/40 px-3 py-2 text-sm font-semibold text-panel-body transition-colors hover:border-dungeon-gold/50 hover:text-dungeon-gold"
						>
							<Github className="size-4" />
							GitHub
						</a>
					</div>
				</nav>

				<Separator className="bg-panel-border/70" />

				<DrawerFooter>
					{isAuthenticated ? (
						<DrawerClose asChild>
							<Button asChild>
								<Link to={MARKETING_ROUTES.GAME}>
									<DoorOpen className="size-4" />
									{MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL}
								</Link>
							</Button>
						</DrawerClose>
					) : (
						<Button disabled>
							<DoorOpen className="size-4" />
							{MARKETING_SHELL_COPY.ENTER_DUNGEON_LABEL}
						</Button>
					)}
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
