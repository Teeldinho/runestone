import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useSettingsForm } from "@/features/settings";
import { useGamePage } from "@/pages/game/model";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	ScrollArea,
} from "@/shared/ui";
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
		handleCameraModeSwitch,
		hasTreasureKeyLabel,
		handleDungeonRunReset,
		playerHp,
		playerMaxHp,
	} = useGamePage();
	const settings = useSettingsForm();
	const [isInspectorOpen, setIsInspectorOpen] = useState(false);

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
				<div className="flex items-center gap-2">
					<span className="rune-text">Room:</span>
					<span className="rune-value" style={{ color: "var(--panel-title)" }}>
						{currentRoomLabel}
					</span>
				</div>
			</header>

			<div className="flex min-h-0 flex-1 overflow-hidden">
				<section
					aria-labelledby="dungeon-canvas-heading"
					className="relative flex min-w-0 flex-1 flex-col"
				>
					<h2 id="dungeon-canvas-heading" className="sr-only">
						Dungeon Canvas
					</h2>
					<div className="flex min-h-0 flex-1">
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

				<aside
					aria-label="Game controls and state"
					className="flex w-72 shrink-0 flex-col border-l"
					style={{
						borderColor: "var(--panel-border)",
						background: "var(--panel)",
					}}
				>
					<ScrollArea className="flex-1">
						<div className="flex flex-col gap-0">
							<div
								className="border-b p-3"
								style={{ borderColor: "var(--panel-border)" }}
							>
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
						</div>
					</ScrollArea>
				</aside>
			</div>

			<Collapsible
				open={isInspectorOpen}
				onOpenChange={setIsInspectorOpen}
				className="shrink-0 border-t"
				style={{ borderColor: "var(--panel-border)" }}
			>
				<CollapsibleTrigger
					className="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-black/20"
					style={{
						color: "var(--muted-foreground)",
						fontFamily: "Space Grotesk, sans-serif",
						letterSpacing: "0.1em",
					}}
				>
					<span>XState Inspector</span>
					{isInspectorOpen ? (
						<ChevronDown className="h-4 w-4 text-[var(--dungeon-gold)]" />
					) : (
						<ChevronRight className="h-4 w-4" />
					)}
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="h-[35vh] min-h-[300px]">
						<XStateInspectorPanel
							activeStateLabel={activeStateLabel}
							graphNodes={graphNodes}
							graphEdges={graphEdges}
						/>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</main>
	);
}
