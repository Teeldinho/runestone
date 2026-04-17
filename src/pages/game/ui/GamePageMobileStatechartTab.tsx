import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";
import { useGamePageMobileSheetContentModel } from "@/pages/game/model";
import { Card, CardContent, ScrollArea, TabsContent } from "@/shared/ui";
import {
	XStateInspectorDetailsPanel,
	XStateInspectorPanel,
} from "@/widgets/xstate-inspector-panel";

export function GamePageMobileStatechartTab() {
	const viewModel = useGamePageMobileSheetContentModel();

	return (
		<TabsContent
			value={GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART}
			className="mt-2 min-h-0 min-w-0 flex-1 overflow-hidden"
		>
			<ScrollArea className="h-full w-full">
				<div className="min-w-0 space-y-2 overflow-x-hidden px-1 py-2">
					<Card className="min-w-0 bg-panel/80 py-0 ring-panel-border/45">
						<CardContent className="h-[27.5rem] min-h-[22.5rem] p-2">
							<XStateInspectorPanel sections={viewModel.graphSections} />
						</CardContent>
					</Card>

					<Card className="min-w-0 bg-panel/80 py-0 ring-panel-border/45">
						<CardContent className="h-[20rem] min-h-[15rem] p-2">
							<XStateInspectorDetailsPanel sections={viewModel.graphSections} />
						</CardContent>
					</Card>
				</div>
			</ScrollArea>
		</TabsContent>
	);
}
