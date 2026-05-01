import { Link } from "@tanstack/react-router";
import { BookOpenText, DoorOpen, Sparkles } from "lucide-react";

import {
	AUTH_ROUTE_PATHS,
	UsernameModal,
	useAuthContext,
} from "@/features/auth";
import { Badge, Button, Card } from "@/shared/ui";

import { HOME_COPY, HOME_FEATURES } from "../config";
import { HomeBootstrapStatusCard } from "./HomeBootstrapStatusCard";

export function HomePage() {
	const {
		authStatus,
		errorMessage,
		handleUsernameFormSubmit,
		isAuthenticated,
		isUsernameModalOpen,
		isUsernameSubmitting,
		readyStatusLabel,
	} = useAuthContext();

	return (
		<>
			<main
				id="main-content"
				className="h-dvh overflow-y-auto overscroll-contain"
			>
				<div className="mx-auto flex min-h-full w-full max-w-4xl items-start px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
					<Card className="w-full gap-0 border-0 bg-panel p-0 shadow-none ring-0">
						<div className="space-y-8 p-6 sm:p-8 lg:p-10">
							<header className="space-y-4 text-left">
								<div className="flex flex-wrap items-center gap-3">
									<Badge
										variant="outline"
										className="gap-2 border-dungeon-gold/30 text-dungeon-gold"
									>
										<Sparkles className="size-3.5" />
										{HOME_COPY.BADGE}
									</Badge>
								</div>

								<div className="max-w-2xl space-y-3">
									<h1 className="text-4xl font-semibold tracking-tight text-panel-title sm:text-5xl">
										{HOME_COPY.HEADING}
									</h1>
									<p className="text-base leading-7 text-panel-body sm:text-lg">
										{HOME_COPY.SUBTITLE}
									</p>
									<p className="text-sm leading-6 text-panel-body">
										{HOME_COPY.SESSION_NOTE}
									</p>
								</div>

								<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
									{isAuthenticated ? (
										<Button asChild size="lg">
											<Link to={AUTH_ROUTE_PATHS.GAME}>
												<DoorOpen />
												{HOME_COPY.CTA_LABEL}
											</Link>
										</Button>
									) : (
										<Button disabled size="lg">
											<DoorOpen />
											{HOME_COPY.CTA_LABEL}
										</Button>
									)}
									<Button asChild size="lg" variant="outline">
										<Link to={AUTH_ROUTE_PATHS.TUTORIAL}>
											<BookOpenText />
											{HOME_COPY.TUTORIAL_LABEL}
										</Link>
									</Button>
								</div>
							</header>

							<HomeBootstrapStatusCard
								authStatus={authStatus}
								readyStatusLabel={readyStatusLabel}
							/>

							<section
								aria-labelledby="home-features-heading"
								className="space-y-3"
							>
								<div className="flex items-center gap-2">
									<span
										aria-hidden="true"
										className="size-1.5 shrink-0 rounded-full bg-dungeon-gold/70"
									/>
									<h2
										id="home-features-heading"
										className="text-xs uppercase tracking-[0.28em] text-dungeon-gold/80"
									>
										{HOME_COPY.FEATURES_HEADING}
									</h2>
								</div>
								<ul className="space-y-3">
									{HOME_FEATURES.map(({ detail, title }) => (
										<li key={title} className="flex items-start gap-3">
											<span
												aria-hidden="true"
												className="mt-2 size-1.5 shrink-0 rounded-full bg-dungeon-gold/70"
											/>
											<div className="space-y-1">
												<p className="text-sm font-semibold text-panel-title">
													{title}
												</p>
												<p className="text-sm leading-6 text-panel-body">
													{detail}
												</p>
											</div>
										</li>
									))}
								</ul>
							</section>
						</div>
					</Card>
				</div>
			</main>
			<UsernameModal
				errorMessage={errorMessage}
				isOpen={isUsernameModalOpen}
				isSubmitting={isUsernameSubmitting}
				onSubmit={handleUsernameFormSubmit}
			/>
		</>
	);
}
