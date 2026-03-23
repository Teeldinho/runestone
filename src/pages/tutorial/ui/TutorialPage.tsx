import { Link } from "@tanstack/react-router";

import { AUTH_ROUTE_PATHS } from "@/features/auth";
import { Button } from "@/shared/ui";

import { TUTORIAL_COPY } from "../config";
import { TutorialControlsCard } from "./TutorialControlsCard";
import { TutorialObjectivesCard } from "./TutorialObjectivesCard";
import { TutorialTipsCard } from "./TutorialTipsCard";

export function TutorialPage() {
	return (
		<main
			id="main-content"
			className="mx-auto flex min-h-dvh max-w-5xl flex-col gap-8 p-8 py-16"
		>
			<header className="space-y-2 text-center">
				<h1 className="text-3xl font-semibold text-panel-title">
					{TUTORIAL_COPY.HEADING}
				</h1>
				<p className="text-panel-body">{TUTORIAL_COPY.SUBTITLE}</p>
			</header>

			<TutorialControlsCard />
			<TutorialObjectivesCard />
			<TutorialTipsCard />

			<div className="flex justify-center">
				<Button asChild size="lg">
					<Link to={AUTH_ROUTE_PATHS.GAME}>{TUTORIAL_COPY.CTA_LABEL}</Link>
				</Button>
			</div>
		</main>
	);
}
