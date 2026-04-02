import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

import { TUTORIAL_CONTROLS, TUTORIAL_COPY } from "../config";

export function TutorialControlsCard() {
	return (
		<Card className="border-panel-border bg-panel shadow-xl">
			<CardHeader>
				<CardTitle className="text-panel-title">
					{TUTORIAL_COPY.CONTROLS_HEADING}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
					{TUTORIAL_CONTROLS.map(({ key, label }) => (
						<div
							key={key}
							className="flex flex-col items-center gap-2 rounded-lg border border-panel-border p-3"
						>
							<dt>
								<Badge
									variant="outline"
									className="px-3 py-1 font-mono text-lg"
								>
									<kbd>{key}</kbd>
								</Badge>
							</dt>
							<dd className="text-sm text-panel-body">{label}</dd>
						</div>
					))}
				</dl>
			</CardContent>
		</Card>
	);
}
