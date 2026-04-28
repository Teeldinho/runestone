import { StateVisualizerWorkspaceProvider } from "@/features/state-visualizer";

import { GamePageDesktopHeader } from "./GamePageDesktopHeader";
import { GamePageDesktopWorkspacePanels } from "./GamePageDesktopWorkspacePanels";

export function GamePageDesktopLayout() {
	return (
		<main
			id="main-content"
			className="flex h-svh w-dvw flex-col overflow-hidden md:h-dvh"
		>
			<GamePageDesktopHeader />

			<StateVisualizerWorkspaceProvider>
				<GamePageDesktopWorkspacePanels />
			</StateVisualizerWorkspaceProvider>
		</main>
	);
}
