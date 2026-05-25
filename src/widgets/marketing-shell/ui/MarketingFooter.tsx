import { Link } from "@tanstack/react-router";

import { MARKETING_SHELL_COPY } from "../config";
import type { MarketingNavigationViewModel } from "../lib";

type MarketingFooterProps = {
	viewModel: MarketingNavigationViewModel;
};

export function MarketingFooter({ viewModel }: MarketingFooterProps) {
	return (
		<footer className="border-panel-border/70 border-t bg-background/80">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-muted-foreground sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
				<p>{MARKETING_SHELL_COPY.FOOTER_COPYRIGHT}</p>

				<nav aria-label="Footer navigation" className="flex flex-wrap gap-3">
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

				<p className="text-dungeon-gold">
					{MARKETING_SHELL_COPY.FOOTER_TAGLINE}
				</p>
			</div>
		</footer>
	);
}
