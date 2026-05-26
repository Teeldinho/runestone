import { Link } from "@tanstack/react-router";

import { cn } from "@/shared/lib";

import {
	MARKETING_LAYOUT_CLASS_NAMES,
	MARKETING_ROUTES,
	MARKETING_SHELL_COPY,
} from "../config";
import type { MarketingNavigationViewModel } from "../lib";

type MarketingFooterProps = {
	viewModel: MarketingNavigationViewModel;
};

export function MarketingFooter({ viewModel }: MarketingFooterProps) {
	return (
		<footer className="border-panel-border/70 border-t bg-background/80">
			<div
				className={cn(
					"mx-auto grid w-full justify-items-center gap-4 px-4 py-6 text-center text-sm text-muted-foreground sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:px-8 lg:justify-items-stretch lg:text-left",
					MARKETING_LAYOUT_CLASS_NAMES.CONTENT_WIDTH,
				)}
			>
				<Link
					to={MARKETING_ROUTES.HOME}
					className="inline-flex items-center text-xs font-bold tracking-[0.28em] justify-self-center lg:justify-self-start"
					aria-label={MARKETING_SHELL_COPY.BRAND_NAME}
				>
					<span className="text-primary">
						{MARKETING_SHELL_COPY.BRAND_RUNE_SEGMENT}
					</span>
					<span className="text-accent">
						{MARKETING_SHELL_COPY.BRAND_STONE_SEGMENT}
					</span>
				</Link>

				<nav
					aria-label="Footer navigation"
					className="flex flex-wrap justify-center gap-3 lg:justify-center"
				>
					{viewModel.footerLinks.map((link) =>
						link.type === "external" ? (
							<a
								key={link.label}
								href={link.to}
								target="_blank"
								rel="noreferrer"
								className="transition-colors hover:text-dungeon-gold"
							>
								{link.label}
							</a>
						) : (
							<Link
								key={link.label}
								to={link.to}
								className="transition-colors hover:text-dungeon-gold"
							>
								{link.label}
							</Link>
						),
					)}
				</nav>

				<p className="text-balance justify-self-center text-xs text-panel-body lg:justify-self-end lg:text-right lg:text-sm">
					{MARKETING_SHELL_COPY.FOOTER_COPYRIGHT}.{" "}
					{MARKETING_SHELL_COPY.FOOTER_TAGLINE}
				</p>
			</div>
		</footer>
	);
}
