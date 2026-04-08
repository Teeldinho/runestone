import { Volume2, VolumeX } from "lucide-react";
import type { CSSProperties } from "react";
import { useSettingsForm } from "@/features/settings";
import { StateVisualizerWorkspaceProvider } from "@/features/state-visualizer";
import { GAME_PAGE_LAYOUT } from "@/pages/game/config";
import { useGamePage } from "@/pages/game/model";
import { ScrollArea } from "@/shared/ui";
import { CameraModeSwitcher } from "@/widgets/camera-mode-switcher";
import { GameCanvas } from "@/widgets/game-canvas";
import { GameHud } from "@/widgets/hud";
import {
	XStateInspectorDetailsPanel,
	XStateInspectorPanel,
} from "@/widgets/xstate-inspector-panel";

export function GamePage() {
	const {
		actionButtons,
		activeStateLabel,
		cameraStateSnapshot,
		canvasMachineRuntime,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		graphSections,
		handleAudioMuteToggle,
		handleCameraModeSwitch,
		hasTreasureKeyLabel,
		handleDungeonRunReset,
		isAudioMuted,
		playerHp,
		playerMaxHp,
	} = useGamePage();
	const settings = useSettingsForm();

	return (
		<main
			id="main-content"
			className="flex h-svh w-dvw flex-col overflow-hidden md:h-dvh"
			style={{ background: "transparent" }}
		>
			<header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-panel-border px-4 py-2">
				<div className="flex items-center gap-3">
					<span
						className="text-lg font-bold tracking-[0.2em]"
						style={{
							color: "var(--dungeon-gold)",
							fontFamily: "Space Grotesk, sans-serif",
						}}
					>
						RUNESTONE
					</span>
					<span className="rune-text">·</span>
					<span className="rune-text">Floor I</span>
				</div>
				<div className="flex items-center gap-2 sm:gap-4">
					<span className="flex shrink-0 items-center gap-2 whitespace-nowrap">
						<span className="rune-text">Room:</span>
						<span
							className="rune-value"
							style={{ color: "var(--panel-title)" }}
						>
							{currentRoomLabel}
						</span>
					</span>
					<button
						type="button"
						onClick={handleAudioMuteToggle}
						className="dungeon-btn w-auto px-2 py-1"
						aria-label={isAudioMuted ? "Unmute audio" : "Mute audio"}
					>
						{isAudioMuted ? (
							<VolumeX className="h-4 w-4" />
						) : (
							<Volume2 className="h-4 w-4 text-[var(--dungeon-gold)]" />
						)}
					</button>
				</div>
			</header>

			<StateVisualizerWorkspaceProvider>
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
					<aside
						aria-label="Statechart graph"
						className="order-2 flex w-full shrink-0 flex-col border-t lg:order-1 lg:w-[var(--game-left-pane-width)] lg:border-r lg:border-t-0"
						style={
							{
								borderColor: "var(--panel-border)",
								background: "var(--panel)",
								"--game-left-pane-width": `${GAME_PAGE_LAYOUT.DESKTOP_LEFT_PANE_WIDTH_REM}rem`,
							} as CSSProperties
						}
					>
						<XStateInspectorPanel sections={graphSections} />
					</aside>

					<div className="order-1 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden lg:order-2">
						<section
							aria-labelledby="dungeon-canvas-heading"
							className="relative flex min-h-0 flex-1 flex-col"
						>
							<h2 id="dungeon-canvas-heading" className="sr-only">
								Dungeon Canvas
							</h2>
							<div className="min-h-0 flex-1" style={{ cursor: "grab" }}>
								<GameCanvas
									cameraStateSnapshot={cameraStateSnapshot}
									machineRuntime={canvasMachineRuntime}
									postprocessingEnabled={settings.postprocessingEnabled}
								/>
							</div>

							<div
								className="shrink-0 border-t p-2"
								style={{
									borderColor: "var(--panel-border)",
								}}
							>
								<CameraModeSwitcher
									activeCameraMode={cameraStateSnapshot.mode}
									handleCameraModeSwitch={handleCameraModeSwitch}
								/>
							</div>
						</section>

						<section
							aria-label="Selected machine details"
							className="shrink-0 border-t"
							style={{
								borderColor: "var(--panel-border)",
								background: "var(--panel)",
								height: `${GAME_PAGE_LAYOUT.DETAILS_PANEL_HEIGHT_DVH}dvh`,
								maxHeight: `${GAME_PAGE_LAYOUT.DETAILS_PANEL_HEIGHT_DVH}dvh`,
							}}
						>
							<XStateInspectorDetailsPanel sections={graphSections} />
						</section>
					</div>

					<aside
						aria-label="Game controls and state"
						className="order-3 flex w-full shrink-0 flex-col border-t lg:w-[var(--game-right-pane-width)] lg:border-l lg:border-t-0"
						style={
							{
								borderColor: "var(--panel-border)",
								background: "var(--panel)",
								"--game-right-pane-width": `${GAME_PAGE_LAYOUT.DESKTOP_RIGHT_PANE_WIDTH_REM}rem`,
							} as CSSProperties
						}
					>
						<ScrollArea className="flex-1">
							<div className="p-3">
								<GameHud
									actionButtons={actionButtons}
									activeStateLabel={activeStateLabel}
									currentRoomLabel={currentRoomLabel}
									discoveredRoomLabels={discoveredRoomLabels}
									enemiesRemaining={enemiesRemaining}
									handleDungeonRunReset={handleDungeonRunReset}
									hasTreasureKeyLabel={hasTreasureKeyLabel}
									playerHp={playerHp}
									playerMaxHp={playerMaxHp}
								/>
							</div>
						</ScrollArea>
					</aside>
				</div>
			</StateVisualizerWorkspaceProvider>
		</main>
	);
}
