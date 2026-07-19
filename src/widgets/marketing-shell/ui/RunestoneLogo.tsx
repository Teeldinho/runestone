import { Link } from "@tanstack/react-router";
import { cn } from "@/shared/lib";

import runestoneMarkUrl from "../assets/runestone-mark.png";
import { MARKETING_ROUTES, type RunestoneLogoVariant } from "../config";
import { useRunestoneLogo } from "../model";

type RunestoneLogoProps = {
	variant: RunestoneLogoVariant;
};

export function RunestoneLogo({ variant }: RunestoneLogoProps) {
	const { ariaLabel, segments, wordmarkClassName } = useRunestoneLogo(variant);

	return (
		<Link
			to={MARKETING_ROUTES.HOME}
			className="inline-flex min-h-11 items-center gap-2.5"
		>
			<span className="sr-only">{ariaLabel}</span>
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
			<span aria-hidden="true" className={cn(wordmarkClassName)}>
				{segments.map((segment) => (
					<span key={segment.id} className={segment.className}>
						{segment.label}
					</span>
				))}
			</span>
		</Link>
	);
}
