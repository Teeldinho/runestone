import { Keyboard, Zap } from "lucide-react";

import { cn } from "@/shared/lib";
import { Card, CardContent } from "@/shared/ui";

import type { TUTORIAL_CONTROL_GROUPS } from "../config";

import {
	TutorialControlRow,
	type TutorialControlRowData,
} from "./TutorialControlRow";

type TutorialControlGroup = (typeof TUTORIAL_CONTROL_GROUPS)[number];

type TutorialControlGroupCardProps = {
	group: TutorialControlGroup;
};

export function TutorialControlGroupCard({
	group,
}: TutorialControlGroupCardProps) {
	return (
		<Card className="rounded-lg border-border bg-card p-0 shadow-none ring-0 hover:border-dungeon-gold/50">
			<CardContent className="space-y-4 p-5 sm:p-6">
				<div className="flex items-center gap-2">
					<div
						className={cn(
							"flex size-9 items-center justify-center rounded-lg border",
							"border-dungeon-gold/30 bg-dungeon-gold/10 text-dungeon-gold",
						)}
					>
						{group.tone === "accent" ? (
							<Zap className="size-4" />
						) : (
							<Keyboard className="size-4" />
						)}
					</div>
					<h3
						className={cn(
							"text-sm font-semibold uppercase tracking-[0.14em]",
							"text-panel-title",
						)}
					>
						{group.heading}
					</h3>
				</div>

				<ul className="divide-y divide-border/70">
					{group.rows.map((row) => (
						<TutorialControlRow
							key={row.label}
							row={row as TutorialControlRowData}
						/>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
