import { useResponsiveGameLayout } from "@/features/responsive-layout";
import { StateVisualizerWorkspaceProvider } from "@/features/state-visualizer";
import { useGamePageMobileLayoutShellModel } from "@/pages/game/model";
import { Drawer } from "@/shared/ui";

import { GamePageMobileCanvasStage } from "./GamePageMobileCanvasStage";
import { GamePageMobileSheetContent } from "./GamePageMobileSheetContent";
import { GamePagePortraitGate } from "./GamePagePortraitGate";

export function GamePageMobileLayout() {
	const viewModel = useGamePageMobileLayoutShellModel();
	const { isPortrait } = useResponsiveGameLayout();

	return (
		<main
			id="main-content"
			className="relative h-dvh w-dvw overflow-hidden overscroll-none"
		>
			<div aria-hidden={isPortrait} className="h-full w-full">
				<StateVisualizerWorkspaceProvider>
					<Drawer
						open={viewModel.isMobileSheetOpen}
						onOpenChange={viewModel.handleMobileSheetOpenChange}
					>
						<GamePageMobileCanvasStage />
						<GamePageMobileSheetContent />
					</Drawer>
				</StateVisualizerWorkspaceProvider>
			</div>

			{isPortrait ? <GamePagePortraitGate /> : null}
		</main>
	);
}
