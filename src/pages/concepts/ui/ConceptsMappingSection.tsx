import {
	ArrowRightLeft,
	DoorOpen,
	Lock,
	MousePointerClick,
	Package,
	Workflow,
} from "lucide-react";

import { cn } from "@/shared/lib";
import { Badge } from "@/shared/ui";

import {
	CONCEPTS_COPY,
	CONCEPTS_MAPPING_TONE_CLASS_NAMES,
	CONCEPTS_SECTIONS,
} from "../config";

const CONCEPTS_SECTION_ICONS = {
	Actor: Workflow,
	Context: Package,
	Event: MousePointerClick,
	Guard: Lock,
	State: DoorOpen,
	Transition: ArrowRightLeft,
} as const;

export function ConceptsMappingSection() {
	return (
		<section aria-labelledby="concepts-grid-heading" className="space-y-6">
			<div className="grid gap-4 lg:grid-cols-2">
				{CONCEPTS_SECTIONS.map((section) => {
					const SectionIcon = CONCEPTS_SECTION_ICONS[section.source];
					const isSealed = section.tone === "sealed";

					return (
						<article
							key={`${section.source}-${section.target}`}
							className={cn(
								"group relative cursor-default overflow-hidden rounded-lg border border-border/75 bg-card/70 p-6 transition-colors sm:p-6",
								isSealed
									? "hover:border-dungeon-rune-sealed/50"
									: "hover:border-dungeon-gold/50",
							)}
						>
							<div className="absolute inset-0 bg-gradient-to-br from-dungeon-gold/8 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
							<div className="relative z-10">
								<div className="mb-4 flex items-center justify-between gap-3">
									<Badge
										variant="outline"
										className="rounded-sm border-border bg-background/45 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-panel-body"
									>
										{section.source}
									</Badge>
								</div>

								<div className="flex items-start gap-4">
									<div
										className={cn(
											"flex size-10 shrink-0 items-center justify-center rounded-md border bg-background/50",
											CONCEPTS_MAPPING_TONE_CLASS_NAMES[section.tone],
										)}
									>
										<SectionIcon aria-hidden="true" className="size-4" />
									</div>

									<div className="space-y-2">
										<h3
											className={cn(
												"text-2xl font-semibold leading-tight tracking-tight sm:text-3xl",
												isSealed
													? "text-dungeon-rune-sealed"
													: "text-panel-title",
											)}
										>
											{section.target}
										</h3>

										<p className="max-w-2xl text-sm leading-6 text-panel-body sm:text-base">
											{section.detail}
										</p>
									</div>
								</div>
							</div>
						</article>
					);
				})}
			</div>

			<h2 id="concepts-grid-heading" className="sr-only">
				{CONCEPTS_COPY.MAPPING_HEADING}
			</h2>
		</section>
	);
}
