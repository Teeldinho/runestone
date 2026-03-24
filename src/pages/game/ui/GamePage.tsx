import { Volume2, VolumeX } from "lucide-react";
import { useSettingsForm } from "@/features/settings";
import { useGamePage } from "@/pages/game/model";
import { ScrollArea } from "@/shared/ui";
import { CameraModeSwitcher } from "@/widgets/camera-mode-switcher";
import { GameCanvas } from "@/widgets/game-canvas";
import { GameHud } from "@/widgets/hud";
import { XStateInspectorPanel } from "@/widgets/xstate-inspector-panel";

export function GamePage() {
	const {
		actionButtons,
		activeStateLabel,
		cameraStateSnapshot,
		canvasMachineRuntime,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		graphEdges,
		graphNodes,
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
			className="flex h-dvh flex-col overflow-hidden"
			style={{ background: "transparent" }}
		>
			<header className="flex shrink-0 items-center justify-between border-b border-panel-border px-4 py-2">
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
				<div className="flex items-center gap-4">
					<span className="flex items-center gap-2">
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

			<div className="flex min-h-0 flex-1 overflow-hidden">
				{/* Left column: Scene + XState Inspector stacked */}
				<div className="flex min-w-0 flex-1 flex-col">
					{/* 3D Scene */}
					<section
						aria-labelledby="dungeon-canvas-heading"
						className="relative flex min-h-0 flex-[3] flex-col"
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
							style={{ borderColor: "var(--panel-border)" }}
						>
							<CameraModeSwitcher
								activeCameraMode={cameraStateSnapshot.mode}
								handleCameraModeSwitch={handleCameraModeSwitch}
							/>
						</div>
					</section>

					{/* XState Inspector - always visible below scene */}
					<section
						aria-labelledby="xstate-inspector-heading"
						className="flex min-h-[280px] flex-[2] flex-col border-t"
						style={{
							borderColor: "var(--panel-border)",
							background: "var(--panel)",
						}}
					>
						<XStateInspectorPanel
							activeStateLabel={activeStateLabel}
							graphNodes={graphNodes}
							graphEdges={graphEdges}
						/>
					</section>
				</div>

				{/* Right column: Sidebar always visible */}
				<aside
					aria-label="Game controls and state"
					className="flex w-72 shrink-0 flex-col border-l"
					style={{
						borderColor: "var(--panel-border)",
						background: "var(--panel)",
					}}
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
		</main>
	);
}
