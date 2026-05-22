import { StateVisualizerWorkspaceProvider } from "@/features/state-visualizer";
import { useGamePageMobileLayoutShellModel } from "@/pages/game/model";
import { Drawer } from "@/shared/ui";

import { GamePageMobileCanvasStage } from "./GamePageMobileCanvasStage";
import { GamePageMobileSheetContent } from "./GamePageMobileSheetContent";
import { GamePagePortraitGate } from "./GamePagePortraitGate";

export function GamePageMobileLayout() {
	const viewModel = useGamePageMobileLayoutShellModel();

	return (
		<main
			id="main-content"
			className="relative h-dvh w-dvw overflow-hidden overscroll-none"
		>
			<StateVisualizerWorkspaceProvider>
				<Drawer
					open={viewModel.drawerOpen}
					onOpenChange={viewModel.handleDrawerOpenChange}
				>
					<GamePageMobileCanvasStage />
					{viewModel.shouldRenderSheetContent ? (
						<GamePageMobileSheetContent />
					) : null}
				</Drawer>
			</StateVisualizerWorkspaceProvider>

			<GamePagePortraitGate isVisible={viewModel.isPortraitGateVisible} />
		</main>
	);
}
