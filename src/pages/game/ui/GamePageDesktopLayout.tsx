import type { ReactNode } from "react";

import { StateVisualizerWorkspaceProvider } from "@/features/state-visualizer";
import type { GamePageViewModel } from "@/pages/game/model";

import { GamePageDesktopHeader } from "./GamePageDesktopHeader";
import { GamePageDesktopWorkspacePanels } from "./GamePageDesktopWorkspacePanels";

type GamePageDesktopLayoutProps = {
	gameHudContent: ReactNode;
	postprocessingEnabled: boolean;
	viewModel: Pick<
		GamePageViewModel,
		| "cameraStateSnapshot"
		| "canvasMachineRuntime"
		| "currentRoomLabel"
		| "graphSections"
		| "handleAudioMuteToggle"
		| "handleCameraModeSwitch"
		| "isAudioMuted"
		| "isMobileTabletLandscape"
	>;
};

export function GamePageDesktopLayout({
	gameHudContent,
	postprocessingEnabled,
	viewModel,
}: GamePageDesktopLayoutProps) {
	return (
		<main
			id="main-content"
			className="flex h-svh w-dvw flex-col overflow-hidden md:h-dvh"
			style={{ background: "transparent" }}
		>
			<GamePageDesktopHeader
				currentRoomLabel={viewModel.currentRoomLabel}
				handleAudioMuteToggle={viewModel.handleAudioMuteToggle}
				isAudioMuted={viewModel.isAudioMuted}
			/>

			<StateVisualizerWorkspaceProvider>
				<GamePageDesktopWorkspacePanels
					gameHudContent={gameHudContent}
					postprocessingEnabled={postprocessingEnabled}
					viewModel={viewModel}
				/>
			</StateVisualizerWorkspaceProvider>
		</main>
	);
}
