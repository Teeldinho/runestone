import { Link } from "@tanstack/react-router";
import { DoorOpen, Gamepad2, Keyboard } from "lucide-react";

import { useAuthContext } from "@/features/auth";
import {
	Badge,
	Button,
	Card,
	CardContent,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/shared/ui";
import {
	MARKETING_NAVIGATION_ITEM_IDS,
	MARKETING_ROUTES,
	MarketingShell,
} from "@/widgets/marketing-shell";

import {
	TUTORIAL_CONCEPT_ROWS,
	TUTORIAL_CONCEPTS_COPY,
	TUTORIAL_CONTROLS_COPY,
	TUTORIAL_COPY,
	TUTORIAL_DESKTOP_CONTROLS,
	TUTORIAL_FIRST_RUN_COPY,
	TUTORIAL_FIRST_RUN_STEPS,
	TUTORIAL_MOBILE_CONTROLS,
	TUTORIAL_TAB_IDS,
	TUTORIAL_TABS,
} from "../config";

export function TutorialPage() {
	const { isAuthenticated } = useAuthContext();

	return (
		<MarketingShell
			activeNavigationItemId={MARKETING_NAVIGATION_ITEM_IDS.GUIDE}
			isAuthenticated={isAuthenticated}
		>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
				<header className="max-w-3xl space-y-4">
					<h1 className="text-4xl font-bold tracking-tight text-panel-title sm:text-5xl">
						{TUTORIAL_COPY.HEADING}
					</h1>
					<p className="text-base leading-7 text-panel-body sm:text-lg">
						{TUTORIAL_COPY.SUBTITLE}
					</p>

					{isAuthenticated ? (
						<Button asChild size="lg">
							<Link to={MARKETING_ROUTES.GAME}>
								<DoorOpen className="size-4" />
								{TUTORIAL_COPY.CTA_LABEL}
							</Link>
						</Button>
					) : (
						<Button disabled size="lg">
							<DoorOpen className="size-4" />
							{TUTORIAL_COPY.CTA_LABEL}
						</Button>
					)}
				</header>

				<Tabs defaultValue={TUTORIAL_TAB_IDS.CONTROLS} className="gap-5">
					<TabsList className="w-fit">
						{TUTORIAL_TABS.map((tab) => (
							<TabsTrigger key={tab.id} value={tab.id}>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>

					<TabsContent value={TUTORIAL_TAB_IDS.CONTROLS}>
						<section className="space-y-5" aria-labelledby="controls-heading">
							<h2
								id="controls-heading"
								className="text-2xl font-semibold text-panel-title"
							>
								{TUTORIAL_CONTROLS_COPY.SECTION_HEADING}
							</h2>

							<div className="grid gap-4 lg:grid-cols-2">
								<Card className="border border-panel-border bg-panel p-0 shadow-none ring-0">
									<CardContent className="space-y-4 p-5 sm:p-6">
										<div className="flex items-center gap-3">
											<div className="flex size-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
												<Keyboard className="size-4" />
											</div>
											<h3 className="text-lg font-semibold text-panel-title">
												{TUTORIAL_CONTROLS_COPY.DESKTOP_HEADING}
											</h3>
										</div>
										<ul className="grid gap-3 sm:grid-cols-2">
											{TUTORIAL_DESKTOP_CONTROLS.map((control) => (
												<li
													key={`${control.label}-${control.detail}`}
													className="rounded-lg border border-panel-border bg-background/40 p-3"
												>
													<p className="text-sm font-semibold text-panel-title">
														{control.label}
													</p>
													<Badge
														variant="outline"
														className="mt-2 border-dungeon-gold/40 text-dungeon-gold"
													>
														{control.detail}
													</Badge>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>

								<Card className="border border-panel-border bg-panel p-0 shadow-none ring-0">
									<CardContent className="space-y-4 p-5 sm:p-6">
										<div className="flex items-center gap-3">
											<div className="flex size-9 items-center justify-center rounded-lg border border-dungeon-gold/30 bg-dungeon-gold/10 text-dungeon-gold">
												<Gamepad2 className="size-4" />
											</div>
											<h3 className="text-lg font-semibold text-panel-title">
												{TUTORIAL_CONTROLS_COPY.MOBILE_TABLET_HEADING}
											</h3>
										</div>
										<ul className="grid gap-3 sm:grid-cols-2">
											{TUTORIAL_MOBILE_CONTROLS.map((control) => (
												<li
													key={control.label}
													className="rounded-lg border border-panel-border bg-background/40 p-3"
												>
													<p className="text-sm font-semibold text-panel-title">
														{control.label}
													</p>
													<p className="mt-2 text-sm leading-6 text-panel-body">
														{control.detail}
													</p>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							</div>
						</section>
					</TabsContent>

					<TabsContent value={TUTORIAL_TAB_IDS.FIRST_RUN}>
						<section className="space-y-5" aria-labelledby="first-run-heading">
							<h2
								id="first-run-heading"
								className="text-2xl font-semibold text-panel-title"
							>
								{TUTORIAL_FIRST_RUN_COPY.SECTION_HEADING}
							</h2>

							<ol className="grid gap-3">
								{TUTORIAL_FIRST_RUN_STEPS.map((step, index) => (
									<li key={step.label}>
										<Card className="border border-panel-border bg-panel p-0 shadow-none ring-0">
											<CardContent className="grid grid-cols-[auto_1fr] gap-4 p-4 sm:p-5">
												<div className="flex flex-col items-center">
													<div className="flex size-9 items-center justify-center rounded-lg border border-dungeon-gold/40 bg-dungeon-gold/10 text-sm font-bold text-dungeon-gold">
														{index + 1}
													</div>
													{index < TUTORIAL_FIRST_RUN_STEPS.length - 1 ? (
														<div className="mt-2 hidden h-10 w-px bg-panel-border sm:block" />
													) : null}
												</div>
												<div className="space-y-1">
													<h3 className="text-sm font-semibold text-panel-title">
														{step.label}
													</h3>
													<p className="text-sm leading-6 text-panel-body">
														{step.detail}
													</p>
												</div>
											</CardContent>
										</Card>
									</li>
								))}
							</ol>
						</section>
					</TabsContent>

					<TabsContent value={TUTORIAL_TAB_IDS.CONCEPTS}>
						<section className="space-y-5" aria-labelledby="concepts-heading">
							<h2
								id="concepts-heading"
								className="text-2xl font-semibold text-panel-title"
							>
								{TUTORIAL_CONCEPTS_COPY.SECTION_HEADING}
							</h2>

							<ul className="grid gap-3 lg:grid-cols-2">
								{TUTORIAL_CONCEPT_ROWS.map((concept) => (
									<li key={concept.label}>
										<Card className="border border-panel-border bg-panel p-0 shadow-none ring-0">
											<CardContent className="space-y-3 p-4 sm:p-5">
												<div className="flex items-start justify-between gap-4">
													<h3 className="text-sm font-semibold text-panel-title">
														{concept.label}
													</h3>
													<Badge
														variant="outline"
														className="border-primary/40 text-primary"
													>
														{concept.monoLabel}
													</Badge>
												</div>
												<p className="text-sm leading-6 text-panel-body">
													{concept.detail}
												</p>
											</CardContent>
										</Card>
									</li>
								))}
							</ul>
						</section>
					</TabsContent>
				</Tabs>
			</div>
		</MarketingShell>
	);
}
