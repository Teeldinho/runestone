import { Camera } from "lucide-react";

import { cn } from "@/shared/lib";
import { Card, CardContent } from "@/shared/ui";

import { TUTORIAL_CAMERA_MODES, TUTORIAL_CONTROLS_COPY } from "../config";

export function TutorialCameraModesCard() {
	return (
		<Card className="rounded-lg border-border bg-card p-0 shadow-none ring-0">
			<CardContent className="space-y-4 p-5 sm:p-6">
				<div className="flex items-center gap-2">
					<div className="flex size-9 items-center justify-center rounded-lg border border-dungeon-gold/30 bg-dungeon-gold/10 text-dungeon-gold">
						<Camera className="size-4" />
					</div>
					<h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-panel-title">
						{TUTORIAL_CONTROLS_COPY.CAMERA_HEADING}
					</h3>
				</div>

				<ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
					{TUTORIAL_CAMERA_MODES.map((mode) => (
						<li
							key={mode.label}
							className="rounded-md border border-border bg-background/35 p-4"
						>
							<div className="flex flex-col gap-2">
								<span className="text-xs uppercase tracking-[0.12em] text-panel-body">
									{mode.label}
								</span>
								<div className="flex items-center justify-between gap-3">
									<span className="text-sm font-semibold text-panel-title">
										{mode.code}
									</span>
									<kbd
										className={cn(
											"inline-flex size-8 items-center justify-center rounded-sm border px-2 py-1 text-xs font-semibold",
											"border-dungeon-gold/30 bg-card text-panel-title",
										)}
									>
										{mode.key}
									</kbd>
								</div>
							</div>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
