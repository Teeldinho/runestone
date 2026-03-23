import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

import { TUTORIAL_COPY, TUTORIAL_TIPS } from "../config";

export function TutorialTipsCard() {
	return (
		<Card className="border-panel-border bg-panel shadow-xl">
			<CardHeader>
				<CardTitle className="text-panel-title">
					{TUTORIAL_COPY.TIPS_HEADING}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-2">
					{TUTORIAL_TIPS.map((tip) => (
						<li key={tip} className="flex gap-2 text-sm text-panel-body">
							<span aria-hidden="true">–</span>
							<span>{tip}</span>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
