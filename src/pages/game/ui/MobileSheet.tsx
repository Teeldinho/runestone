import type {
	CameraMachineEvent,
	CameraStateSnapshot,
} from "@/features/camera-system";
import {
	Card,
	CardContent,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	ScrollArea,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/shared/ui";
import { CameraModeSwitcher } from "@/widgets/camera-mode-switcher";
import {
	XStateInspectorDetailsPanel,
	XStateInspectorPanel,
} from "@/widgets/xstate-inspector-panel";

import { GAME_PAGE_MOBILE_SHEET } from "../config";

type MobileSheetProps = {
	graphSections: Parameters<typeof XStateInspectorPanel>[0]["sections"];
	mobileSheetTabId: string;
	onMobileSheetTabChange: (tabId: string) => void;
	cameraStateSnapshot: CameraStateSnapshot;
	onCameraModeSwitch: (event: CameraMachineEvent) => void;
	gameHudContent: React.ReactNode;
};

export function MobileSheet({
	graphSections,
	mobileSheetTabId,
	onMobileSheetTabChange,
	cameraStateSnapshot,
	onCameraModeSwitch,
	gameHudContent,
}: MobileSheetProps) {
	return (
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
					onValueChange={onMobileSheetTabChange}
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
										<XStateInspectorDetailsPanel sections={graphSections} />
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
											handleCameraModeSwitch={onCameraModeSwitch}
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
	);
}
