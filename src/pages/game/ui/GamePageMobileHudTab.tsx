import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";
import { useGamePageMobileSheetContentModel } from "@/pages/game/model";
import { Card, CardContent, ScrollArea, TabsContent } from "@/shared/ui";
import { CameraModeSwitcher } from "@/widgets/camera-mode-switcher";

import { GamePageHudPanel } from "./GamePageHudPanel";

export function GamePageMobileHudTab() {
	const viewModel = useGamePageMobileSheetContentModel();

	return (
		<TabsContent
			value={GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD}
			className="mt-2 min-h-0 min-w-0 flex-1 overflow-hidden"
		>
			<ScrollArea className="h-full w-full">
				<div className="min-w-0 space-y-2 overflow-x-hidden px-1 py-2">
					<Card className="min-w-0 bg-panel/80 py-0 ring-panel-border/45">
						<CardContent className="px-2 py-2">
							<CameraModeSwitcher
								activeCameraMode={viewModel.cameraStateSnapshot.mode}
								handleCameraModeSwitch={viewModel.handleCameraModeSwitch}
							/>
						</CardContent>
					</Card>

					<Card className="min-w-0 bg-panel/80 py-0 ring-panel-border/45">
						<CardContent className="px-0 py-0">
							<GamePageHudPanel />
						</CardContent>
					</Card>
				</div>
			</ScrollArea>
		</TabsContent>
	);
}
