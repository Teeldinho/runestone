import { Layers, RotateCcw, Trophy, Volume2, VolumeX } from "lucide-react";
import { useCallback, useState } from "react";
import { CAMERA_MODES } from "@/features/camera-system";
import { useSettingsForm } from "@/features/settings";
import {
	CameraControlZone,
	TouchJoystickOverlay,
} from "@/features/touch-input";
import { Badge, Button, Drawer, DrawerTrigger } from "@/shared/ui";
import { MobileCameraModeSwitcher } from "@/widgets/camera-mode-switcher";
import { GameCanvas } from "@/widgets/game-canvas";
import { GameHud } from "@/widgets/hud";
import { LeaderboardSheet } from "@/widgets/leaderboard-panel";
import { GAME_PAGE_MOBILE_SHEET } from "../config";
import { useGamePage } from "../model";
import { MobileSheet } from "./MobileSheet";

export function MobileGameLayout() {
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
		handleDungeonRunReset,
		handleMobileSheetOpenChange,
		handleMobileSheetTabChange,
		handleTouchAttack,
		handleTouchInteract,
		handleTouchJoystickMove,
		handleTouchJoystickStop,
		hasTouchAttack,
		hasTouchInteract,
		hasTreasureKeyLabel,
		isAudioMuted,
		isMobileSheetOpen,
		isTabletLayout,
		mobileSheetTabId,
		playerHp,
		playerMaxHp,
		touchAttackPrompt,
		touchInteractPrompt,
	} = useGamePage();

	const settings = useSettingsForm();

	const [firstPersonLookElement, setFirstPersonLookElement] =
		useState<HTMLElement | null>(null);
	const firstPersonLookRef = useCallback((node: HTMLElement | null) => {
		setFirstPersonLookElement(node);
	}, []);

	const [cameraControlElement, setCameraControlElement] =
		useState<HTMLElement | null>(null);
	const cameraControlRef = useCallback((node: HTMLElement | null) => {
		setCameraControlElement(node);
	}, []);

	const gameHudContent = (
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
	);

	return (
		<main
			id="main-content"
			className="relative h-dvh w-dvw overflow-hidden overscroll-none"
			style={{ background: "transparent" }}
		>
			<Drawer
				open={isMobileSheetOpen}
				onOpenChange={handleMobileSheetOpenChange}
			>
				<section
					aria-labelledby="dungeon-canvas-heading"
					className="relative h-full w-full"
				>
					<h2 id="dungeon-canvas-heading" className="sr-only">
						Dungeon Canvas
					</h2>
					<div className="h-full w-full" style={{ cursor: "grab" }}>
						<GameCanvas
							cameraControlElement={cameraControlElement}
							cameraStateSnapshot={cameraStateSnapshot}
							firstPersonLookElement={firstPersonLookElement}
							machineRuntime={canvasMachineRuntime}
							postprocessingEnabled={settings.postprocessingEnabled}
						/>
					</div>

					<div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3 flex justify-between">
						<div className="pointer-events-auto flex flex-col gap-1.5">
							<span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
								Camera
							</span>
							<MobileCameraModeSwitcher
								activeCameraMode={cameraStateSnapshot.mode}
								handleCameraModeSwitch={handleCameraModeSwitch}
							/>
							<Button
								variant="dungeon-outline"
								size="default"
								onClick={handleDungeonRunReset}
								className="pointer-events-auto w-full"
								aria-label="Restart Run"
							>
								<RotateCcw className="h-4 w-4" />
								<span className="text-xs uppercase tracking-wide">
									Reset Run
								</span>
							</Button>
						</div>
						<div className="h-fit w-fit rounded border border-panel-border bg-panel px-3 py-1 shadow-lg backdrop-blur-md">
							<div className="flex items-center gap-2 leading-none">
								<span className="rune-text text-[10px] leading-none text-dungeon-gold">
									HP
								</span>
								<span className="rune-value text-sm leading-none">
									{playerHp} / {playerMaxHp}
								</span>
							</div>
						</div>
					</div>

					<div className="pointer-events-none absolute bottom-4 left-4 z-30">
						<div className="pointer-events-auto">
							<TouchJoystickOverlay
								onMoveVelocity={handleTouchJoystickMove}
								onStopVelocity={handleTouchJoystickStop}
							/>
						</div>
					</div>

					{cameraStateSnapshot.mode === CAMERA_MODES.FIRST_PERSON && (
						<div
							ref={firstPersonLookRef}
							id="fp-look-zone"
							className="pointer-events-auto absolute bottom-0 right-0 top-0 z-20 touch-none select-none"
							style={{ left: "50%" }}
						/>
					)}

					<CameraControlZone zoneRef={cameraControlRef} />

					<div className="pointer-events-none absolute bottom-4 right-4 z-30 flex w-[11rem] flex-col gap-2 empty:hidden items-end">
						{hasTouchInteract ? (
							<Button
								variant="default"
								size="default"
								onClick={handleTouchInteract}
								className="pointer-events-auto relative w-full font-bold"
							>
								{touchInteractPrompt}
								<Badge className="absolute -right-2 -top-2 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-dungeon-gold p-0 shadow-[0_0_8px_var(--dungeon-gold)]" />
							</Button>
						) : null}
						{hasTouchAttack ? (
							<Button
								variant="default"
								size="default"
								onClick={handleTouchAttack}
								className="pointer-events-auto relative w-full font-bold"
							>
								{touchAttackPrompt}
								<Badge className="absolute -right-2 -top-2 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-success p-0 shadow-[0_0_8px_var(--success)]" />
							</Button>
						) : null}
						<Button
							variant={isAudioMuted ? "dungeon-outline" : "dungeon-gold"}
							size={isTabletLayout ? "default" : "icon"}
							onClick={handleAudioMuteToggle}
							className={`pointer-events-auto ${isTabletLayout ? "w-full" : "h-9 w-9 p-0"}`}
							aria-label={isAudioMuted ? "Unmute audio" : "Mute audio"}
						>
							{isAudioMuted ? (
								<VolumeX className="h-4 w-4" />
							) : (
								<Volume2 className="h-4 w-4" />
							)}
							{isTabletLayout && (
								<span className="text-xs uppercase tracking-wide">Audio</span>
							)}
						</Button>
						<LeaderboardSheet>
							<Button
								variant="dungeon-outline"
								size={isTabletLayout ? "default" : "icon"}
								className={`pointer-events-auto flex items-center justify-center gap-2 ${isTabletLayout ? "w-full" : "h-9 w-9 p-0"}`}
								aria-label="Open Leaderboard"
							>
								<Trophy className="h-4 w-4" />
								{isTabletLayout && (
									<span className="text-xs uppercase tracking-wide">
										Rankings
									</span>
								)}
							</Button>
						</LeaderboardSheet>
						<DrawerTrigger asChild>
							<Button
								variant={isMobileSheetOpen ? "dungeon-gold" : "dungeon-outline"}
								size={isTabletLayout ? "default" : "icon"}
								className={`pointer-events-auto ${isTabletLayout ? "w-full" : "h-9 w-9 p-0"}`}
							>
								<Layers className="h-4 w-4" />
								{isTabletLayout && (
									<span className="text-xs uppercase tracking-wide">
										{GAME_PAGE_MOBILE_SHEET.OPEN_BUTTON_LABEL}
									</span>
								)}
							</Button>
						</DrawerTrigger>
					</div>
				</section>

				<MobileSheet
					graphSections={graphSections}
					mobileSheetTabId={mobileSheetTabId}
					onMobileSheetTabChange={handleMobileSheetTabChange}
					cameraStateSnapshot={cameraStateSnapshot}
					onCameraModeSwitch={handleCameraModeSwitch}
					gameHudContent={gameHudContent}
				/>
			</Drawer>
		</main>
	);
}
