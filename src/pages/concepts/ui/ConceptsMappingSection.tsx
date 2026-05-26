import { cn } from "@/shared/lib";
import { Badge } from "@/shared/ui";

import type { ConceptsMappingSectionViewModel } from "../lib";

type ConceptsMappingSectionProps = {
	heading: string;
	sections: readonly ConceptsMappingSectionViewModel[];
};

export function ConceptsMappingSection({
	heading,
	sections,
}: ConceptsMappingSectionProps) {
	return (
		<section aria-labelledby="concepts-grid-heading" className="space-y-6">
			<div className="grid gap-4 lg:grid-cols-2">
				{sections.map((section) => {
					const SectionIcon = section.icon;

					return (
						<article
							key={section.id}
							className={cn(
								"group relative cursor-default overflow-hidden rounded-lg border border-border/75 bg-card/70 p-6 transition-colors sm:p-6",
								section.isSealed
									? "hover:border-dungeon-rune-sealed/50"
									: "hover:border-dungeon-gold/50",
							)}
						>
							<div className="absolute inset-0 bg-gradient-to-br from-dungeon-gold/8 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
							<div className="relative z-10 space-y-4">
								<Badge
									variant="outline"
									className="rounded-sm border-border bg-background/45 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-panel-body"
								>
									{section.badge}
								</Badge>

								<div className="flex items-start gap-4">
									<div
										className={cn(
											"flex size-10 shrink-0 items-center justify-center rounded-md border bg-background/50",
											section.iconClassName,
										)}
									>
										<SectionIcon aria-hidden="true" className="size-4" />
									</div>

									<div className="space-y-2">
										<h3
											className={cn(
												"text-2xl font-semibold leading-tight tracking-tight sm:text-3xl",
												section.titleClassName,
											)}
										>
											{section.title}
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
				{heading}
			</h2>
		</section>
	);
}
