import { Link } from "@tanstack/react-router";
import runestoneMarkUrl from "../assets/runestone-mark.png";
import { MARKETING_ROUTES, MARKETING_SHELL_COPY } from "../config";

type RunestoneLogoProps = {
	variant: "desktop" | "compact";
};

export function RunestoneLogo({ variant }: RunestoneLogoProps) {
	const isDesktop = variant === "desktop";

	return (
		<Link
			to={MARKETING_ROUTES.HOME}
			className="inline-flex items-center gap-2.5"
			aria-label={MARKETING_SHELL_COPY.BRAND_NAME}
		>
			<span
				aria-hidden="true"
				className="flex size-8 shrink-0 items-center justify-center"
			>
				<img
					alt=""
					aria-hidden="true"
					className="size-full object-contain"
					src={runestoneMarkUrl}
				/>
			</span>
			<span
				className={
					isDesktop
						? "text-base font-bold tracking-[0.28em] sm:text-lg"
						: "text-base font-bold tracking-[0.2em]"
				}
			>
				{isDesktop ? (
					<>
						<span className="text-primary">
							{MARKETING_SHELL_COPY.BRAND_RUNE_SEGMENT}
						</span>
						<span className="text-accent">
							{MARKETING_SHELL_COPY.BRAND_STONE_SEGMENT}
						</span>
					</>
				) : (
					<>
						<span className="text-primary">
							{MARKETING_SHELL_COPY.COMPACT_BRAND_RUNE_SEGMENT}
						</span>
						<span className="text-accent">
							{MARKETING_SHELL_COPY.COMPACT_BRAND_STONE_SEGMENT}
						</span>
					</>
				)}
			</span>
		</Link>
	);
}
