import { Link } from "@tanstack/react-router";
import { DoorOpen } from "lucide-react";

import { Button } from "@/shared/ui";
import { MARKETING_ROUTES } from "@/widgets/marketing-shell";

import { CONCEPTS_COPY } from "../config";

type ConceptsCtaSectionProps = {
	isAuthenticated: boolean;
	onEntryRequest: () => void;
};

export function ConceptsCtaSection({
	isAuthenticated,
	onEntryRequest,
}: ConceptsCtaSectionProps) {
	return (
		<section
			aria-labelledby="concepts-cta-heading"
			className="border-t border-border pt-10"
		>
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="space-y-1">
					<h2
						id="concepts-cta-heading"
						className="text-2xl font-semibold text-foreground sm:text-3xl"
					>
						{CONCEPTS_COPY.CTA_HEADING}
					</h2>
					<p className="text-sm leading-6 text-panel-body sm:text-base">
						{CONCEPTS_COPY.CTA_SUBTITLE}
					</p>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row">
					<Button
						asChild
						variant="ghost"
						className="h-auto justify-start px-0 py-0 text-dungeon-gold hover:bg-transparent hover:text-dungeon-gold sm:px-3"
					>
						<Link to={MARKETING_ROUTES.GUIDE}>
							{CONCEPTS_COPY.SECONDARY_LINK_LABEL}
						</Link>
					</Button>
					{isAuthenticated ? (
						<Button asChild size="lg">
							<Link to={MARKETING_ROUTES.GAME}>
								<DoorOpen className="size-4" />
								{CONCEPTS_COPY.CTA_LABEL}
							</Link>
						</Button>
					) : (
						<Button type="button" size="lg" onClick={onEntryRequest}>
							<DoorOpen className="size-4" />
							{CONCEPTS_COPY.CTA_LABEL}
						</Button>
					)}
				</div>
			</div>
		</section>
	);
}
