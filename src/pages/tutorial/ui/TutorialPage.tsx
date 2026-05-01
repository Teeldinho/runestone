import { Link } from "@tanstack/react-router";
import { BookOpenText, DoorOpen, House } from "lucide-react";

import { AUTH_ROUTE_PATHS, useAuthContext } from "@/features/auth";
import { Badge, Button, Card } from "@/shared/ui";

import { TUTORIAL_COPY } from "../config";
import { TutorialControlsCard } from "./TutorialControlsCard";
import { TutorialObjectivesCard } from "./TutorialObjectivesCard";
import { TutorialTipsCard } from "./TutorialTipsCard";

export function TutorialPage() {
	const { isAuthenticated } = useAuthContext();

	return (
		<main
			id="main-content"
			className="h-dvh overflow-y-auto overscroll-contain"
		>
			<div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-8">
				<Card className="w-full gap-0 border-0 bg-panel p-0 shadow-none ring-0">
					<div className="space-y-0 p-6 sm:p-8 lg:p-10">
						<header className="space-y-4 text-left">
							<div className="flex flex-wrap items-center gap-3">
								<Badge
									variant="outline"
									className="gap-2 border-dungeon-gold/30 text-dungeon-gold"
								>
									<BookOpenText className="size-3.5" />
									{TUTORIAL_COPY.BADGE}
								</Badge>
							</div>

							<div className="max-w-2xl space-y-3">
								<h1 className="text-4xl font-semibold tracking-tight text-panel-title sm:text-5xl">
									{TUTORIAL_COPY.HEADING}
								</h1>
								<p className="text-base leading-7 text-panel-body sm:text-lg">
									{TUTORIAL_COPY.SUBTITLE}
								</p>
							</div>

							<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
								{isAuthenticated ? (
									<Button asChild size="lg">
										<Link to={AUTH_ROUTE_PATHS.GAME}>
											<DoorOpen />
											{TUTORIAL_COPY.CTA_LABEL}
										</Link>
									</Button>
								) : (
									<Button disabled size="lg">
										<DoorOpen />
										{TUTORIAL_COPY.CTA_LABEL}
									</Button>
								)}
								<Button asChild size="lg" variant="outline">
									<Link to={AUTH_ROUTE_PATHS.HOME}>
										<House />
										{TUTORIAL_COPY.HOME_LABEL}
									</Link>
								</Button>
							</div>
						</header>

						<div className="mt-8 overflow-hidden rounded-2xl bg-background/10 ring-1 ring-panel-border/40 divide-y divide-panel-border/60">
							<TutorialControlsCard />
							<TutorialObjectivesCard />
							<TutorialTipsCard />
						</div>
					</div>
				</Card>
			</div>
		</main>
	);
}
