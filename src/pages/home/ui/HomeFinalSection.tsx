import { ArrowUpRight } from "lucide-react";

import { Button } from "@/shared/ui";
import { MARKETING_ROUTES } from "@/widgets/marketing-shell";

import { HOME_COPY } from "../config";
import type { HomePageViewModel } from "../lib";
import { HomeEntryAction } from "./HomeEntryAction";

type HomeFinalSectionProps = {
	entryProps: HomePageViewModel["entryProps"];
};

export function HomeFinalSection({ entryProps }: HomeFinalSectionProps) {
	return (
		<section
			aria-labelledby="final-heading"
			className="relative grid gap-8 overflow-hidden rounded-3xl border border-dungeon-gold/35 bg-card/80 px-5 py-8 shadow-2xl sm:px-8 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10 lg:py-12"
		>
			<div
				aria-hidden="true"
				className="absolute -right-20 -bottom-32 size-80 rounded-full bg-dungeon-gold/15 blur-3xl"
			/>
			<div className="relative z-10 max-w-2xl space-y-3">
				<h2
					id="final-heading"
					className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
				>
					{HOME_COPY.FINAL_HEADING}
				</h2>
				<p className="text-pretty leading-7 text-panel-body">
					{HOME_COPY.FINAL_SUBTITLE}
				</p>
			</div>

			<div className="relative z-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-start">
				<HomeEntryAction {...entryProps} label={HOME_COPY.FINAL_CTA_LABEL} />
				<Button
					asChild
					size="lg"
					variant="outline"
					className="min-h-11 w-full border-panel-border bg-background/45 px-5 hover:border-dungeon-rune/50 hover:bg-dungeon-rune/10 hover:text-dungeon-rune sm:w-auto"
				>
					<a
						href={MARKETING_ROUTES.GITHUB_REPOSITORY}
						target="_blank"
						rel="noreferrer"
					>
						View source
						<ArrowUpRight aria-hidden="true" />
					</a>
				</Button>
			</div>
		</section>
	);
}
