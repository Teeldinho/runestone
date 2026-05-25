import { Link } from "@tanstack/react-router";
import { ArrowRight, DoorOpen } from "lucide-react";

import { useAuthContext } from "@/features/auth";
import { Button, Card, CardContent } from "@/shared/ui";
import {
	MARKETING_NAVIGATION_ITEM_IDS,
	MARKETING_ROUTES,
	MarketingShell,
} from "@/widgets/marketing-shell";

import { CONCEPTS_COPY, CONCEPTS_SECTIONS } from "../config";

export function ConceptsPage() {
	const { isAuthenticated } = useAuthContext();

	return (
		<MarketingShell
			activeNavigationItemId={MARKETING_NAVIGATION_ITEM_IDS.CONCEPTS}
			isAuthenticated={isAuthenticated}
		>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
				<header className="max-w-3xl space-y-4">
					<h1 className="text-4xl font-bold tracking-tight text-panel-title sm:text-5xl">
						{CONCEPTS_COPY.HEADING}
					</h1>
					<p className="text-base leading-7 text-panel-body sm:text-lg">
						{CONCEPTS_COPY.SUBTITLE}
					</p>
				</header>

				<section
					aria-label={CONCEPTS_COPY.HEADING}
					className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
				>
					{CONCEPTS_SECTIONS.map((section) => (
						<Card
							key={section.label}
							className="border border-panel-border bg-panel p-0 shadow-none ring-0"
						>
							<CardContent className="space-y-3 p-5">
								<div className="flex items-center justify-between gap-4">
									<h2 className="text-sm font-semibold text-panel-title">
										{section.label}
									</h2>
									<ArrowRight className="size-4 text-dungeon-gold" />
								</div>
								<p className="text-sm leading-6 text-panel-body">
									{section.detail}
								</p>
							</CardContent>
						</Card>
					))}
				</section>

				<Card className="border border-dungeon-gold/40 bg-panel p-0 shadow-none ring-0">
					<CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
						<h2 className="text-2xl font-semibold text-panel-title">
							{CONCEPTS_COPY.CTA_HEADING}
						</h2>
						<div className="flex flex-col gap-3 sm:flex-row">
							{isAuthenticated ? (
								<Button asChild size="lg">
									<Link to={MARKETING_ROUTES.GAME}>
										<DoorOpen className="size-4" />
										{CONCEPTS_COPY.CTA_LABEL}
									</Link>
								</Button>
							) : (
								<Button disabled size="lg">
									<DoorOpen className="size-4" />
									{CONCEPTS_COPY.CTA_LABEL}
								</Button>
							)}
							<Button asChild size="lg" variant="dungeon-gold">
								<Link to={MARKETING_ROUTES.GUIDE}>
									{CONCEPTS_COPY.SECONDARY_LINK_LABEL}
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</MarketingShell>
	);
}
