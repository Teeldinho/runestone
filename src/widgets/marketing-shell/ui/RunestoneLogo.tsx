import { Link } from "@tanstack/react-router";

import { MARKETING_ROUTES, MARKETING_SHELL_COPY } from "../config";

type RunestoneLogoProps = {
	variant: "desktop" | "compact";
};

export function RunestoneLogo({ variant }: RunestoneLogoProps) {
	if (variant === "desktop") {
		return (
			<Link
				to={MARKETING_ROUTES.HOME}
				className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.28em]"
				aria-label={MARKETING_SHELL_COPY.BRAND_NAME}
			>
				<span
					aria-hidden="true"
					className="relative flex size-7 items-center justify-center rounded-lg border border-primary/40 bg-primary/10"
				>
					<span className="absolute size-3 rounded-sm border border-dungeon-gold/70 rotate-45" />
					<span className="size-1.5 rounded-full bg-primary" />
				</span>
				<span>
					<span className="text-primary">
						{MARKETING_SHELL_COPY.BRAND_RUNE_SEGMENT}
					</span>
					<span className="text-accent">
						{MARKETING_SHELL_COPY.BRAND_STONE_SEGMENT}
					</span>
				</span>
			</Link>
		);
	}

	return (
		<Link
			to={MARKETING_ROUTES.HOME}
			className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.26em]"
			aria-label={MARKETING_SHELL_COPY.BRAND_NAME}
		>
			<span
				aria-hidden="true"
				className="relative flex size-7 items-center justify-center rounded-lg border border-primary/40 bg-primary/10"
			>
				<span className="absolute size-3 rounded-sm border border-dungeon-gold/70 rotate-45" />
				<span className="size-1.5 rounded-full bg-primary" />
			</span>
			<span>
				<span className="text-primary">
					{MARKETING_SHELL_COPY.COMPACT_BRAND_RUNE_SEGMENT}
				</span>
				<span className="text-accent">
					{MARKETING_SHELL_COPY.COMPACT_BRAND_STONE_SEGMENT}
				</span>
			</span>
		</Link>
	);
}
