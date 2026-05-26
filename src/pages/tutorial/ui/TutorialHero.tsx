import { Link } from "@tanstack/react-router";
import { BookOpen, DoorOpen } from "lucide-react";

import { Button } from "@/shared/ui";
import { MARKETING_ROUTES } from "@/widgets/marketing-shell";

import { TUTORIAL_COPY } from "../config";

type TutorialHeroProps = {
	isAuthenticated: boolean;
	onEntryRequest: () => void;
};

export function TutorialHero({
	isAuthenticated,
	onEntryRequest,
}: TutorialHeroProps) {
	return (
		<header className="max-w-3xl space-y-3">
			<div className="flex items-center gap-2">
				<BookOpen className="size-4 text-dungeon-gold" />
				<h1 className="text-3xl font-bold tracking-tight text-panel-title sm:text-4xl">
					{TUTORIAL_COPY.HEADING}
				</h1>
			</div>
			<p className="max-w-2xl text-base leading-7 text-panel-body sm:text-lg">
				{TUTORIAL_COPY.SUBTITLE}
			</p>

			{isAuthenticated ? (
				<Button asChild size="default">
					<Link to={MARKETING_ROUTES.GAME}>
						<DoorOpen className="size-4" />
						{TUTORIAL_COPY.CTA_LABEL}
					</Link>
				</Button>
			) : (
				<Button type="button" size="default" onClick={onEntryRequest}>
					<DoorOpen className="size-4" />
					{TUTORIAL_COPY.CTA_LABEL}
				</Button>
			)}
		</header>
	);
}
