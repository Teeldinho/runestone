import { StateVisualizerWorkspaceProvider } from "@/features/state-visualizer";
import { useGamePageMobileLayoutShellModel } from "@/pages/game/model";
import { Drawer } from "@/shared/ui";

import { GamePageMobileCanvasStage } from "./GamePageMobileCanvasStage";
import { GamePageMobileSheetContent } from "./GamePageMobileSheetContent";

export function GamePageMobileLayout() {
	const viewModel = useGamePageMobileLayoutShellModel();

	return (
		<main
			id="main-content"
			className="relative h-dvh w-dvw overflow-hidden overscroll-none"
		>
			<StateVisualizerWorkspaceProvider>
				<Drawer
					open={viewModel.isMobileSheetOpen}
					onOpenChange={viewModel.handleMobileSheetOpenChange}
				>
					<GamePageMobileCanvasStage />
					<GamePageMobileSheetContent />
				</Drawer>
			</StateVisualizerWorkspaceProvider>
		</main>
	);
}
