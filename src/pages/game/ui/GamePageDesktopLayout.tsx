import { StateVisualizerWorkspaceProvider } from "@/features/state-visualizer";

import { GamePageDesktopHeader } from "./GamePageDesktopHeader";
import { GamePageDesktopWorkspacePanels } from "./GamePageDesktopWorkspacePanels";

export function GamePageDesktopLayout() {
	return (
		<main
			id="main-content"
			className="observatory-backdrop isolate flex h-svh w-dvw flex-col overflow-hidden bg-background text-foreground md:h-dvh"
		>
			<GamePageDesktopHeader />

			<StateVisualizerWorkspaceProvider>
				<GamePageDesktopWorkspacePanels />
			</StateVisualizerWorkspaceProvider>
		</main>
	);
}
