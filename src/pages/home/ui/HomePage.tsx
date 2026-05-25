import { Link } from "@tanstack/react-router";
import { ArrowRight, DoorOpen, Key } from "lucide-react";

import { UsernameModal, useAuthContext } from "@/features/auth";
import { Badge, Button, Card, CardContent, Separator } from "@/shared/ui";
import { MARKETING_ROUTES, MarketingShell } from "@/widgets/marketing-shell";

import {
	HOME_COPY,
	HOME_FEATURES,
	HOME_MANIFEST_PATH,
	HOME_MANIFEST_TONE_CLASS_NAMES,
	HOME_RUNTIME_PANELS,
	HOME_TRANSLATION_RAIL,
} from "../config";
import { HomeBootstrapStatusCard } from "./HomeBootstrapStatusCard";

export function HomePage() {
	const {
		authStatus,
		errorMessage,
		handleSessionBootstrapRetry,
		handleUsernameFormSubmit,
		isAuthenticated,
		isUsernameModalOpen,
		isUsernameSubmitting,
		readyStatusLabel,
		suggestedUsername,
	} = useAuthContext();

	return (
		<>
			<MarketingShell
				activeNavigationItemId={null}
				isAuthenticated={isAuthenticated}
			>
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
					<section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch">
						<Card className="border border-panel-border bg-panel p-0 shadow-none ring-0">
							<CardContent className="flex h-full flex-col gap-6 p-5 sm:p-6 lg:p-8">
								<div className="space-y-4">
									<Badge
										variant="outline"
										className="w-fit border-dungeon-gold/40 text-dungeon-gold"
									>
										{HOME_COPY.BADGE}
									</Badge>

									<div className="space-y-4">
										<h1 className="max-w-2xl text-4xl font-bold tracking-tight text-panel-title sm:text-5xl lg:text-6xl">
											{HOME_COPY.HEADING}
										</h1>
										<p className="max-w-2xl text-base leading-7 text-panel-body sm:text-lg">
											{HOME_COPY.SUBTITLE}
										</p>
									</div>
								</div>

								<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
									{isAuthenticated ? (
										<Button asChild size="lg">
											<Link to={MARKETING_ROUTES.GAME}>
												<DoorOpen className="size-4" />
												{HOME_COPY.CTA_LABEL}
											</Link>
										</Button>
									) : (
										<Button disabled size="lg">
											<DoorOpen className="size-4" />
											{HOME_COPY.CTA_LABEL}
										</Button>
									)}

									<Button asChild size="lg" variant="dungeon-gold">
										<Link to={MARKETING_ROUTES.GUIDE}>
											{HOME_COPY.TUTORIAL_LABEL}
										</Link>
									</Button>
								</div>

								<div className="rounded-lg border border-panel-border bg-background/40 p-4 sm:hidden">
									<p className="text-sm leading-6 text-panel-body">
										{HOME_COPY.MOBILE_ORIENTATION_NOTICE}
									</p>
								</div>

								<HomeBootstrapStatusCard
									authStatus={authStatus}
									errorMessage={errorMessage}
									onRetry={handleSessionBootstrapRetry}
									readyStatusLabel={readyStatusLabel}
								/>
							</CardContent>
						</Card>

						<Card className="overflow-hidden border border-panel-border bg-panel p-0 shadow-none ring-0">
							<CardContent className="p-0">
								<div className="border-panel-border border-b bg-background/50 px-5 py-4 sm:px-6">
									<div className="space-y-1">
										<h2 className="text-lg font-semibold text-panel-title">
											{HOME_COPY.MANIFEST_PATH_HEADING}
										</h2>
										<p className="text-sm text-panel-body">
											{HOME_COPY.MANIFEST_PATH_SUBTITLE}
										</p>
									</div>
								</div>

								<ol className="relative grid gap-3 p-5 sm:p-6">
									{HOME_MANIFEST_PATH.map((item, index) => (
										<li
											key={item.label}
											className="grid grid-cols-[auto_1fr] gap-3"
										>
											<div className="flex flex-col items-center">
												<div
													className={[
														"flex size-9 items-center justify-center rounded-lg border text-sm font-bold",
														HOME_MANIFEST_TONE_CLASS_NAMES[item.tone],
													].join(" ")}
												>
													{index + 1}
												</div>
												{index < HOME_MANIFEST_PATH.length - 1 ? (
													<div className="my-1 h-8 w-px bg-panel-border" />
												) : null}
											</div>
											<div className="rounded-lg border border-panel-border bg-card/90 p-4">
												<h3 className="text-sm font-semibold text-panel-title">
													{item.label}
												</h3>
												<p className="mt-1 text-sm leading-6 text-panel-body">
													{item.detail}
												</p>
											</div>
										</li>
									))}
								</ol>
							</CardContent>
						</Card>
					</section>

					<section
						aria-labelledby="translation-rail-heading"
						className="space-y-4"
					>
						<h2
							id="translation-rail-heading"
							className="text-sm font-semibold uppercase tracking-[0.28em] text-dungeon-gold"
						>
							{HOME_COPY.MANIFEST_PATH_HEADING}
						</h2>
						<ul className="grid gap-3 md:grid-cols-5">
							{HOME_TRANSLATION_RAIL.map((item) => (
								<li key={item}>
									<Card className="border border-panel-border bg-panel p-0 shadow-none ring-0">
										<CardContent className="flex items-center justify-between gap-3 p-4">
											<span className="text-sm font-semibold text-panel-title">
												{item}
											</span>
											<ArrowRight className="size-4 text-dungeon-gold" />
										</CardContent>
									</Card>
								</li>
							))}
						</ul>
					</section>

					<section
						aria-labelledby="runtime-heading"
						className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"
					>
						<div className="space-y-3">
							<h2
								id="runtime-heading"
								className="text-2xl font-semibold tracking-tight text-panel-title"
							>
								{HOME_COPY.RUNTIME_HEADING}
							</h2>
							<p className="max-w-xl text-sm leading-6 text-panel-body sm:text-base">
								{HOME_COPY.RUNTIME_SUBTITLE}
							</p>
						</div>

						<ul className="grid gap-3 sm:grid-cols-3">
							{HOME_RUNTIME_PANELS.map((panel) => (
								<li key={panel.label}>
									<Card className="border border-panel-border bg-panel p-0 shadow-none ring-0">
										<CardContent className="space-y-3 p-4">
											<div className="flex size-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
												<ArrowRight className="size-4" />
											</div>
											<div className="space-y-1">
												<h3 className="text-sm font-semibold text-panel-title">
													{panel.label}
												</h3>
												<p className="text-sm leading-6 text-panel-body">
													{panel.detail}
												</p>
											</div>
										</CardContent>
									</Card>
								</li>
							))}
						</ul>
					</section>

					<Separator className="bg-panel-border/70" />

					<section aria-labelledby="teaching-heading" className="space-y-5">
						<div className="flex items-center gap-2">
							<Key className="size-4 text-dungeon-gold" />
							<h2
								id="teaching-heading"
								className="text-2xl font-semibold tracking-tight text-panel-title"
							>
								{HOME_COPY.FEATURES_HEADING}
							</h2>
						</div>

						<ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
							{HOME_FEATURES.map(({ detail, title }) => (
								<li key={title}>
									<Card className="border border-panel-border bg-panel p-0 shadow-none ring-0">
										<CardContent className="space-y-3 p-4">
											<div className="flex size-8 items-center justify-center rounded-lg border border-dungeon-gold/30 text-dungeon-gold">
												<ArrowRight className="size-4" />
											</div>
											<div className="space-y-1">
												<h3 className="text-sm font-semibold text-panel-title">
													{title}
												</h3>
												<p className="text-sm leading-6 text-panel-body">
													{detail}
												</p>
											</div>
										</CardContent>
									</Card>
								</li>
							))}
						</ul>
					</section>
				</div>
			</MarketingShell>

			<UsernameModal
				errorMessage={errorMessage}
				isOpen={isUsernameModalOpen}
				isSubmitting={isUsernameSubmitting}
				suggestedUsername={suggestedUsername}
				onSubmit={handleUsernameFormSubmit}
			/>
		</>
	);
}
