import { Layers, RotateCcw, Trophy, Volume2, VolumeX } from "lucide-react";
import { type CSSProperties, useCallback, useState } from "react";
import { CAMERA_MODES } from "@/features/camera-system";
import { useSettingsForm } from "@/features/settings";
import { StateVisualizerWorkspaceProvider } from "@/features/state-visualizer";
import {
	CameraControlZone,
	TouchJoystickOverlay,
} from "@/features/touch-input";
import { GAME_PAGE_LAYOUT, GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";
import { useGamePage } from "@/pages/game/model";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	ScrollArea,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/shared/ui";
import {
	CameraModeSwitcher,
	MobileCameraModeSwitcher,
} from "@/widgets/camera-mode-switcher";
import { GameCanvas } from "@/widgets/game-canvas";
import { GameHud } from "@/widgets/hud";
import { LeaderboardSheet } from "@/widgets/leaderboard-panel";
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
		handleMobileSheetOpenChange,
		handleMobileSheetTabChange,
		handleTouchAttack,
		handleTouchInteract,
		handleTouchJoystickMove,
		handleTouchJoystickStop,
		hasTouchAttack,
		hasTouchInteract,
		hasTreasureKeyLabel,
		handleDungeonRunReset,
		isAudioMuted,
		isDesktopLayout,
		isMobileSheetOpen,
		isMobileTabletLandscape,
		isTabletLayout,
		mobileSheetTabId,
		playerHp,
		playerMaxHp,
		touchAttackPrompt,
		touchInteractPrompt,
	} = useGamePage();
	const settings = useSettingsForm();

	// Ref-callback pattern: re-renders (and thus syncs to OrbitControls) when the
	// element mounts or unmounts, unlike a plain useRef which stays stable.
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
				actions={{ actionButtons, handleDungeonRunReset }}
				playerStats={{ playerHp, playerMaxHp }}
				snapshot={{
					activeStateLabel,
					currentRoomLabel,
					discoveredRoomLabels,
					enemiesRemaining,
					hasTreasureKeyLabel,
				}}
			/>
		</div>
	);

	if (!isDesktopLayout && !isMobileTabletLandscape) {
		return (
			<main id="main-content" className="h-dvh w-dvw overflow-hidden">
				<section className="flex h-full w-full items-center justify-center p-4">
					<Card className="w-full max-w-sm bg-panel/95 py-0 ring-panel-border/60">
						<CardHeader className="pt-5 text-center">
							<CardTitle className="rune-text text-base text-panel-title">
								Rotate Device
							</CardTitle>
							<CardDescription className="text-sm">
								Landscape mode is required on mobile and tablet.
							</CardDescription>
						</CardHeader>
						<CardContent className="pb-5 text-center text-xs text-muted-foreground">
							Rotate your device to landscape to continue playing.
						</CardContent>
					</Card>
				</section>
			</main>
		);
	}

	if (isMobileTabletLandscape) {
		return (
			<main
				id="main-content"
				className="relative h-dvh w-dvw overflow-hidden overscroll-none"
				style={{ background: "transparent" }}
			>
				<StateVisualizerWorkspaceProvider>
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
										<span className="text-xs uppercase tracking-wide">
											Audio
										</span>
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
										variant={
											isMobileSheetOpen ? "dungeon-gold" : "dungeon-outline"
										}
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

						<DrawerContent
							className="max-w-full overflow-hidden border-panel-border/60 bg-panel/95"
							style={{ height: `${GAME_PAGE_MOBILE_SHEET.HEIGHT_DVH}dvh` }}
							aria-label="Game bottom sheet panels"
						>
							<DrawerHeader>
								<DrawerTitle>{GAME_PAGE_MOBILE_SHEET.TITLE}</DrawerTitle>
								<DrawerDescription>
									{GAME_PAGE_MOBILE_SHEET.DESCRIPTION}
								</DrawerDescription>
							</DrawerHeader>
							<div className="min-h-0 min-w-0 flex-1 overflow-hidden px-3 pb-3">
								<Tabs
									value={mobileSheetTabId}
									onValueChange={handleMobileSheetTabChange}
									className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden"
								>
									<TabsList className="grid h-auto w-full min-w-0 grid-cols-2 gap-2 border-0 bg-transparent p-0">
										<TabsTrigger
											value={GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART}
											className="h-8 min-w-0 truncate border border-panel-border/45 bg-panel/45 data-[state=active]:bg-panel"
										>
											{GAME_PAGE_MOBILE_SHEET.TAB_LABELS.STATECHART}
										</TabsTrigger>
										<TabsTrigger
											value={GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD}
											className="h-8 min-w-0 truncate border border-panel-border/45 bg-panel/45 data-[state=active]:bg-panel"
										>
											{GAME_PAGE_MOBILE_SHEET.TAB_LABELS.HUD}
										</TabsTrigger>
									</TabsList>

									<TabsContent
										value={GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART}
										className="mt-2 min-h-0 min-w-0 flex-1 overflow-hidden"
									>
										<ScrollArea className="h-full w-full">
											<div className="min-w-0 space-y-2 overflow-x-hidden px-1 py-2">
												<Card className="min-w-0 bg-panel/80 py-0 ring-panel-border/45">
													<CardContent className="h-[27.5rem] min-h-[22.5rem] p-2">
														<XStateInspectorPanel sections={graphSections} />
													</CardContent>
												</Card>
												<Card className="min-w-0 bg-panel/80 py-0 ring-panel-border/45">
													<CardContent className="h-[20rem] min-h-[15rem] p-2">
														<XStateInspectorDetailsPanel
															sections={graphSections}
														/>
													</CardContent>
												</Card>
											</div>
										</ScrollArea>
									</TabsContent>

									<TabsContent
										value={GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD}
										className="mt-2 min-h-0 min-w-0 flex-1 overflow-hidden"
									>
										<ScrollArea className="h-full w-full">
											<div className="min-w-0 space-y-2 overflow-x-hidden px-1 py-2">
												<Card className="min-w-0 bg-panel/80 py-0 ring-panel-border/45">
													<CardContent className="px-2 py-2">
														<CameraModeSwitcher
															activeCameraMode={cameraStateSnapshot.mode}
															handleCameraModeSwitch={handleCameraModeSwitch}
														/>
													</CardContent>
												</Card>
												<Card className="min-w-0 bg-panel/80 py-0 ring-panel-border/45">
													<CardContent className="px-0 py-0">
														{gameHudContent}
													</CardContent>
												</Card>
											</div>
										</ScrollArea>
									</TabsContent>
								</Tabs>
							</div>
						</DrawerContent>
					</Drawer>
				</StateVisualizerWorkspaceProvider>
			</main>
		);
	}

	const workspacePanels = (
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

			<div className="order-1 flex min-h-0 min-w-0 flex-1 flex-col lg:order-2 lg:overflow-hidden">
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
				{isMobileTabletLandscape ? (
					gameHudContent
				) : (
					<ScrollArea className="flex-1">{gameHudContent}</ScrollArea>
				)}
			</aside>
		</div>
	);

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
					<LeaderboardSheet>
						<button
							type="button"
							className="dungeon-btn w-auto px-2 py-1"
							aria-label="Open Leaderboard"
						>
							<Trophy className="h-4 w-4 text-[var(--dungeon-gold)]" />
						</button>
					</LeaderboardSheet>
				</div>
			</header>

			<StateVisualizerWorkspaceProvider>
				{workspacePanels}
			</StateVisualizerWorkspaceProvider>
		</main>
	);
}
