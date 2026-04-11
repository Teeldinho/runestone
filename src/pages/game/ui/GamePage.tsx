import { Volume2, VolumeX } from "lucide-react";
import type { CSSProperties } from "react";
import { useSettingsForm } from "@/features/settings";
import { StateVisualizerWorkspaceProvider } from "@/features/state-visualizer";
import { TouchJoystickOverlay } from "@/features/touch-input";
import { GAME_PAGE_LAYOUT, GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";
import { useGamePage } from "@/pages/game/model";
import {
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
		handleMobileSheetOpenChange,
		handleMobileSheetTabChange,
		handleTouchJoystickMove,
		handleTouchJoystickStop,
		hasTreasureKeyLabel,
		handleDungeonRunReset,
		isAudioMuted,
		isMobileSheetOpen,
		isMobileTabletLandscape,
		mobileSheetTabId,
		playerHp,
		playerMaxHp,
	} = useGamePage();
	const settings = useSettingsForm();
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
									cameraStateSnapshot={cameraStateSnapshot}
									machineRuntime={canvasMachineRuntime}
									postprocessingEnabled={settings.postprocessingEnabled}
								/>
							</div>

							<div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3">
								<div className="ml-auto w-fit rounded border border-panel-border bg-panel/80 px-3 py-2 shadow-lg backdrop-blur-md">
									<div className="flex items-center gap-2">
										<span className="rune-text text-[10px] text-dungeon-gold">
											HP
										</span>
										<span className="rune-value text-sm">
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

							<div className="pointer-events-none absolute bottom-4 right-4 z-30 flex flex-col items-end gap-2">
								<button
									type="button"
									onClick={handleAudioMuteToggle}
									className="pointer-events-auto dungeon-btn w-auto px-3 py-2"
									aria-label={isAudioMuted ? "Unmute audio" : "Mute audio"}
								>
									{isAudioMuted ? (
										<VolumeX className="h-4 w-4" />
									) : (
										<Volume2 className="h-4 w-4 text-[var(--dungeon-gold)]" />
									)}
								</button>
								<DrawerTrigger asChild>
									<button
										type="button"
										className="pointer-events-auto dungeon-btn w-auto px-3 py-2 text-xs uppercase tracking-wide"
									>
										{GAME_PAGE_MOBILE_SHEET.OPEN_BUTTON_LABEL}
									</button>
								</DrawerTrigger>
							</div>
						</section>

						<DrawerContent
							className="max-w-full overflow-hidden"
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
									<TabsList className="grid h-auto w-full min-w-0 grid-cols-2 gap-1 p-1">
										<TabsTrigger
											value={GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART}
											className="h-8 min-w-0 truncate"
										>
											{GAME_PAGE_MOBILE_SHEET.TAB_LABELS.STATECHART}
										</TabsTrigger>
										<TabsTrigger
											value={GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD}
											className="h-8 min-w-0 truncate"
										>
											{GAME_PAGE_MOBILE_SHEET.TAB_LABELS.HUD}
										</TabsTrigger>
									</TabsList>

									<TabsContent
										value={GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART}
										className="mt-3 min-h-0 min-w-0 flex-1 overflow-hidden"
									>
										<ScrollArea className="h-full w-full rounded border border-panel-border bg-panel/70">
											<div className="min-w-0 space-y-3 overflow-x-hidden p-3">
												<section className="h-[27.5rem] min-h-[22.5rem] min-w-0 overflow-hidden rounded border border-panel-border bg-panel">
													<XStateInspectorPanel sections={graphSections} />
												</section>
												<section className="h-[320px] min-h-[240px] min-w-0 overflow-hidden rounded border border-panel-border bg-panel">
													<XStateInspectorDetailsPanel
														sections={graphSections}
													/>
												</section>
											</div>
										</ScrollArea>
									</TabsContent>

									<TabsContent
										value={GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD}
										className="mt-3 min-h-0 min-w-0 flex-1 overflow-hidden"
									>
										<ScrollArea className="h-full w-full rounded border border-panel-border bg-panel/70">
											<div className="min-w-0 space-y-3 overflow-x-hidden p-3">
												<section className="min-w-0 overflow-hidden rounded border border-panel-border bg-panel">
													<CameraModeSwitcher
														activeCameraMode={cameraStateSnapshot.mode}
														handleCameraModeSwitch={handleCameraModeSwitch}
													/>
												</section>
												{gameHudContent}
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
				</div>
			</header>

			<StateVisualizerWorkspaceProvider>
				{workspacePanels}
			</StateVisualizerWorkspaceProvider>
		</main>
	);
}
