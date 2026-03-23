import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

import { TUTORIAL_COPY, TUTORIAL_OBJECTIVES } from "../config";

export function TutorialObjectivesCard() {
	return (
		<Card className="border-panel-border bg-panel shadow-xl">
			<CardHeader>
				<CardTitle className="text-panel-title">
					{TUTORIAL_COPY.OBJECTIVES_HEADING}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ol className="space-y-3">
					{TUTORIAL_OBJECTIVES.map(({ step, label, detail }) => (
						<li key={step} className="flex items-start gap-3">
							<Badge
								variant="secondary"
								className="mt-0.5 shrink-0 tabular-nums"
							>
								{step}
							</Badge>
							<div>
								<span className="font-semibold text-panel-title">{label}</span>
								<p className="text-sm text-panel-body">{detail}</p>
							</div>
						</li>
					))}
				</ol>
			</CardContent>
		</Card>
	);
}
