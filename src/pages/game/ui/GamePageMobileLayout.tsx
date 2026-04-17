import { Layers, RotateCcw, Trophy, Volume2, VolumeX } from "lucide-react";
import type { ReactNode } from "react";

import { CAMERA_MODES } from "@/features/camera-system";
import { StateVisualizerWorkspaceProvider } from "@/features/state-visualizer";
import {
	CameraControlZone,
	TouchJoystickOverlay,
} from "@/features/touch-input";
import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";
import type { GamePageViewModel } from "@/pages/game/model";
import {
	Badge,
	Button,
	Card,
	CardContent,
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
import { LeaderboardSheet } from "@/widgets/leaderboard-panel";
import {
	XStateInspectorDetailsPanel,
	XStateInspectorPanel,
} from "@/widgets/xstate-inspector-panel";

type GamePageMobileLayoutProps = {
	cameraElements: {
		cameraControlElement: HTMLElement | null;
		cameraControlRef: (node: HTMLElement | null) => void;
		firstPersonLookElement: HTMLElement | null;
		firstPersonLookRef: (node: HTMLElement | null) => void;
	};
	gameHudContent: ReactNode;
	postprocessingEnabled: boolean;
	viewModel: Pick<
		GamePageViewModel,
		| "cameraStateSnapshot"
		| "canvasMachineRuntime"
		| "graphSections"
		| "handleAudioMuteToggle"
		| "handleCameraModeSwitch"
		| "handleDungeonRunReset"
		| "handleMobileSheetOpenChange"
		| "handleMobileSheetTabChange"
		| "handleTouchAttack"
		| "handleTouchInteract"
		| "handleTouchJoystickMove"
		| "handleTouchJoystickStop"
		| "hasTouchAttack"
		| "hasTouchInteract"
		| "isAudioMuted"
		| "isMobileSheetOpen"
		| "isTabletLayout"
		| "mobileSheetTabId"
		| "playerHp"
		| "playerMaxHp"
		| "touchAttackPrompt"
		| "touchInteractPrompt"
	>;
};

export function GamePageMobileLayout({
	cameraElements,
	gameHudContent,
	postprocessingEnabled,
	viewModel,
}: GamePageMobileLayoutProps) {
	return (
		<main
			id="main-content"
			className="relative h-dvh w-dvw overflow-hidden overscroll-none"
			style={{ background: "transparent" }}
		>
			<StateVisualizerWorkspaceProvider>
				<Drawer
					open={viewModel.isMobileSheetOpen}
					onOpenChange={viewModel.handleMobileSheetOpenChange}
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
								cameraControlElement={cameraElements.cameraControlElement}
								cameraStateSnapshot={viewModel.cameraStateSnapshot}
								firstPersonLookElement={cameraElements.firstPersonLookElement}
								machineRuntime={viewModel.canvasMachineRuntime}
								postprocessingEnabled={postprocessingEnabled}
							/>
						</div>

						<div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-between p-3">
							<div className="pointer-events-auto flex flex-col gap-1.5">
								<span className="ml-1 text-[10px] font-semibold tracking-widest text-muted-foreground/70 uppercase">
									Camera
								</span>

								<MobileCameraModeSwitcher
									activeCameraMode={viewModel.cameraStateSnapshot.mode}
									handleCameraModeSwitch={viewModel.handleCameraModeSwitch}
								/>

								<Button
									variant="dungeon-outline"
									size="default"
									onClick={viewModel.handleDungeonRunReset}
									className="pointer-events-auto w-full"
									aria-label="Restart Run"
								>
									<RotateCcw className="h-4 w-4" />
									<span className="text-xs tracking-wide uppercase">
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
										{viewModel.playerHp} / {viewModel.playerMaxHp}
									</span>
								</div>
							</div>
						</div>

						<div className="pointer-events-none absolute bottom-4 left-4 z-30">
							<div className="pointer-events-auto">
								<TouchJoystickOverlay
									onMoveVelocity={viewModel.handleTouchJoystickMove}
									onStopVelocity={viewModel.handleTouchJoystickStop}
								/>
							</div>
						</div>

						{viewModel.cameraStateSnapshot.mode ===
							CAMERA_MODES.FIRST_PERSON && (
							<div
								ref={cameraElements.firstPersonLookRef}
								id="fp-look-zone"
								className="pointer-events-auto absolute inset-y-0 right-0 z-20 touch-none select-none"
								style={{ left: "50%" }}
							/>
						)}

						<CameraControlZone zoneRef={cameraElements.cameraControlRef} />

						<div className="pointer-events-none absolute right-4 bottom-4 z-30 flex w-[11rem] flex-col items-end gap-2 empty:hidden">
							{viewModel.hasTouchInteract ? (
								<Button
									variant="default"
									size="default"
									onClick={viewModel.handleTouchInteract}
									className="pointer-events-auto relative w-full font-bold"
								>
									{viewModel.touchInteractPrompt}
									<Badge className="absolute -top-2 -right-2 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-dungeon-gold p-0 shadow-[0_0_8px_var(--dungeon-gold)]" />
								</Button>
							) : null}

							{viewModel.hasTouchAttack ? (
								<Button
									variant="default"
									size="default"
									onClick={viewModel.handleTouchAttack}
									className="pointer-events-auto relative w-full font-bold"
								>
									{viewModel.touchAttackPrompt}
									<Badge className="absolute -top-2 -right-2 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-success p-0 shadow-[0_0_8px_var(--success)]" />
								</Button>
							) : null}

							<Button
								variant={
									viewModel.isAudioMuted ? "dungeon-outline" : "dungeon-gold"
								}
								size={viewModel.isTabletLayout ? "default" : "icon"}
								onClick={viewModel.handleAudioMuteToggle}
								className={`pointer-events-auto ${viewModel.isTabletLayout ? "w-full" : "h-9 w-9 p-0"}`}
								aria-label={
									viewModel.isAudioMuted ? "Unmute audio" : "Mute audio"
								}
							>
								{viewModel.isAudioMuted ? (
									<VolumeX className="h-4 w-4" />
								) : (
									<Volume2 className="h-4 w-4" />
								)}

								{viewModel.isTabletLayout && (
									<span className="text-xs tracking-wide uppercase">Audio</span>
								)}
							</Button>

							<LeaderboardSheet>
								<Button
									variant="dungeon-outline"
									size={viewModel.isTabletLayout ? "default" : "icon"}
									className={`pointer-events-auto flex items-center justify-center gap-2 ${viewModel.isTabletLayout ? "w-full" : "h-9 w-9 p-0"}`}
									aria-label="Open Leaderboard"
								>
									<Trophy className="h-4 w-4" />
									{viewModel.isTabletLayout && (
										<span className="text-xs tracking-wide uppercase">
											Rankings
										</span>
									)}
								</Button>
							</LeaderboardSheet>

							<DrawerTrigger asChild>
								<Button
									variant={
										viewModel.isMobileSheetOpen
											? "dungeon-gold"
											: "dungeon-outline"
									}
									size={viewModel.isTabletLayout ? "default" : "icon"}
									className={`pointer-events-auto ${viewModel.isTabletLayout ? "w-full" : "h-9 w-9 p-0"}`}
								>
									<Layers className="h-4 w-4" />
									{viewModel.isTabletLayout && (
										<span className="text-xs tracking-wide uppercase">
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
								value={viewModel.mobileSheetTabId}
								onValueChange={viewModel.handleMobileSheetTabChange}
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
													<XStateInspectorPanel
														sections={viewModel.graphSections}
													/>
												</CardContent>
											</Card>

											<Card className="min-w-0 bg-panel/80 py-0 ring-panel-border/45">
												<CardContent className="h-[20rem] min-h-[15rem] p-2">
													<XStateInspectorDetailsPanel
														sections={viewModel.graphSections}
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
														activeCameraMode={
															viewModel.cameraStateSnapshot.mode
														}
														handleCameraModeSwitch={
															viewModel.handleCameraModeSwitch
														}
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
