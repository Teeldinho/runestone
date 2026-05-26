import { ArrowRight } from "lucide-react";

import { cn } from "@/shared/lib";
import { MARKETING_LAYOUT_CLASS_NAMES } from "@/widgets/marketing-shell";

import { HOME_TRANSLATION_ARROW_CLASS_NAME } from "../config";
import type { HomeTranslationItemViewModel } from "../lib";

type HomeTranslationRailProps = {
	items: readonly HomeTranslationItemViewModel[];
};

export function HomeTranslationRail({ items }: HomeTranslationRailProps) {
	return (
		<ul
			aria-label="Concept translations"
			className={cn(
				MARKETING_LAYOUT_CLASS_NAMES.TOKEN_RAIL,
				"lg:grid lg:grid-cols-5 lg:items-stretch lg:gap-0 lg:overflow-hidden",
			)}
		>
			{items.map((item) => (
				<li
					key={item.label}
					className={cn(
						"flex items-center gap-2 whitespace-nowrap",
						"lg:justify-center lg:border-r lg:border-border/70 lg:px-3",
						item.isLast ? "lg:border-r-0" : "",
					)}
				>
					<span className="rounded-sm border border-border bg-background/45 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-panel-body">
						{item.label}
					</span>
					<ArrowRight
						aria-hidden="true"
						className={cn("size-4 shrink-0", HOME_TRANSLATION_ARROW_CLASS_NAME)}
					/>
					<span
						className={cn(
							"text-sm font-semibold sm:text-base",
							item.toneClassName,
						)}
					>
						{item.target}
					</span>
				</li>
			))}
		</ul>
	);
}
