import { cn } from "@/shared/lib";

import {
	MARKETING_SHELL_COPY,
	RUNESTONE_LOGO_SEGMENT_CLASS_NAMES,
	RUNESTONE_LOGO_SEGMENT_IDS,
	RUNESTONE_LOGO_VARIANTS,
	type RunestoneLogoSegmentId,
	type RunestoneLogoVariant,
} from "../config";

export type CreateRunestoneLogoViewModelInput = {
	variant: RunestoneLogoVariant;
};

export type RunestoneLogoSegmentViewModel = {
	className: string;
	id: RunestoneLogoSegmentId;
	label: string;
};

export type RunestoneLogoViewModel = {
	ariaLabel: string;
	segments: readonly RunestoneLogoSegmentViewModel[];
	wordmarkClassName: string;
};

export const createRunestoneLogoViewModel = ({
	variant,
}: CreateRunestoneLogoViewModelInput): RunestoneLogoViewModel => {
	const isDesktop = variant === RUNESTONE_LOGO_VARIANTS.DESKTOP;

	return {
		ariaLabel: MARKETING_SHELL_COPY.BRAND_NAME,
		segments: [
			{
				className:
					RUNESTONE_LOGO_SEGMENT_CLASS_NAMES[RUNESTONE_LOGO_SEGMENT_IDS.RUNE],
				id: RUNESTONE_LOGO_SEGMENT_IDS.RUNE,
				label: isDesktop
					? MARKETING_SHELL_COPY.BRAND_RUNE_SEGMENT
					: MARKETING_SHELL_COPY.COMPACT_BRAND_RUNE_SEGMENT,
			},
			{
				className:
					RUNESTONE_LOGO_SEGMENT_CLASS_NAMES[RUNESTONE_LOGO_SEGMENT_IDS.STONE],
				id: RUNESTONE_LOGO_SEGMENT_IDS.STONE,
				label: isDesktop
					? MARKETING_SHELL_COPY.BRAND_STONE_SEGMENT
					: MARKETING_SHELL_COPY.COMPACT_BRAND_STONE_SEGMENT,
			},
		],
		wordmarkClassName: cn(
			"text-base font-bold",
			isDesktop ? "tracking-[0.28em] sm:text-lg" : "tracking-[0.2em]",
		),
	};
};
