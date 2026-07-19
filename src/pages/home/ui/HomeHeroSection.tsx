import { ArrowDownRight } from "lucide-react";

import { Badge, Button } from "@/shared/ui";

import { HOME_COPY, HOME_SECTION_IDS } from "../config";
import type { HomePageViewModel } from "../lib";

import { HomeEntryAction } from "./HomeEntryAction";
import { HomeRuntimeDiagram } from "./HomeRuntimeDiagram";

type HomeHeroSectionProps = {
	entryProps: HomePageViewModel["entryProps"];
};

export function HomeHeroSection({ entryProps }: HomeHeroSectionProps) {
	return (
		<section className="relative grid min-h-[calc(100dvh-8rem)] items-center gap-12 overflow-hidden rounded-3xl border border-panel-border bg-card/55 px-5 py-10 shadow-2xl backdrop-blur-sm sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(30rem,1.1fr)] lg:gap-16 lg:px-12 lg:py-16">
			<div
				aria-hidden="true"
				className="absolute -top-32 -left-24 size-80 rounded-full bg-dungeon-gold/10 blur-3xl"
			/>
			<div className="relative z-10 max-w-2xl space-y-8">
				<Badge
					variant="outline"
					className="rounded-full border-dungeon-gold/50 bg-dungeon-gold/10 px-3 py-1 text-dungeon-torch"
				>
					{HOME_COPY.BADGE}
				</Badge>

				<div className="space-y-5">
					<h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
						{HOME_COPY.HEADING}
					</h1>
					<p className="max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
						{HOME_COPY.SUBTITLE}
					</p>
				</div>

				<div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-start">
					<HomeEntryAction {...entryProps} label={HOME_COPY.CTA_LABEL} />
					<Button
						asChild
						size="lg"
						variant="dungeon-outline"
						className="min-h-11 w-full px-4 sm:w-auto"
					>
						<a href={`#${HOME_SECTION_IDS.HOW_IT_WORKS}`}>
							{HOME_COPY.TRACE_LABEL}
							<ArrowDownRight aria-hidden="true" />
						</a>
					</Button>
				</div>

				<p className="font-mono text-xs text-panel-body sm:text-sm">
					{HOME_COPY.HERO_META}
				</p>
			</div>

			<HomeRuntimeDiagram />
		</section>
	);
}
