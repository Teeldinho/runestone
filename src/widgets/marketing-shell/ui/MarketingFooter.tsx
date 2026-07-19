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
		<footer className="border-panel-border border-t bg-card/75 text-foreground backdrop-blur-xl">
			<div
				className={cn(
					"mx-auto grid w-full justify-items-center gap-4 px-4 py-8 text-center text-sm text-muted-foreground sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:px-8 lg:justify-items-stretch lg:text-left",
					MARKETING_LAYOUT_CLASS_NAMES.CONTENT_WIDTH,
				)}
			>
				<Link
					to={MARKETING_ROUTES.HOME}
					className="inline-flex min-h-11 items-center text-xs font-bold tracking-[0.28em] justify-self-center lg:justify-self-start"
					aria-label={MARKETING_SHELL_COPY.BRAND_NAME}
				>
					<span className="text-dungeon-rune">
						{MARKETING_SHELL_COPY.BRAND_RUNE_SEGMENT}
					</span>
					<span className="text-dungeon-gold">
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
								href={link.href}
								target="_blank"
								rel="noreferrer"
								className="inline-flex min-h-11 items-center transition-colors hover:text-dungeon-rune"
							>
								{link.label}
							</a>
						) : (
							<a
								key={link.label}
								href={link.href}
								className="inline-flex min-h-11 items-center transition-colors hover:text-dungeon-rune"
							>
								{link.label}
							</a>
						),
					)}
				</nav>

				<p className="text-balance justify-self-center text-xs text-muted-foreground lg:justify-self-end lg:text-right lg:text-sm">
					{MARKETING_SHELL_COPY.FOOTER_COPYRIGHT}.{" "}
					{MARKETING_SHELL_COPY.FOOTER_TAGLINE}
				</p>
			</div>
		</footer>
	);
}
