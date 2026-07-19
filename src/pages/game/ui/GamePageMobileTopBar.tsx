import { RotateCcw } from "lucide-react";

import { GAME_PAGE_MOBILE_TOP_BAR_TEST_IDS } from "@/pages/game/config";
import { useGamePageMobileTopBarModel } from "@/pages/game/model";
import { Button } from "@/shared/ui";
import { MobileCameraModeSwitcher } from "@/widgets/camera-mode-switcher";

import { GamePageHomeAction } from "./GamePageHomeAction";

export function GamePageMobileTopBar() {
	const viewModel = useGamePageMobileTopBarModel();

	return (
		<div
			data-testid={GAME_PAGE_MOBILE_TOP_BAR_TEST_IDS.ROOT}
			className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))] pl-[max(0.75rem,env(safe-area-inset-left))]"
		>
			<div
				data-testid={GAME_PAGE_MOBILE_TOP_BAR_TEST_IDS.LEFT_CLUSTER}
				className="pointer-events-auto flex flex-col gap-1.5"
			>
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
					className="pointer-events-auto min-h-11 w-full"
					aria-label="Restart Run"
				>
					<RotateCcw className="h-4 w-4" />
					<span className="text-xs tracking-wide uppercase">Reset Run</span>
				</Button>
			</div>

			<div
				data-testid={GAME_PAGE_MOBILE_TOP_BAR_TEST_IDS.RIGHT_CLUSTER}
				className="pointer-events-auto flex shrink-0 items-center gap-2"
			>
				<div
					data-testid={GAME_PAGE_MOBILE_TOP_BAR_TEST_IDS.HP_PANEL}
					className="flex min-h-11 w-fit items-center rounded-lg border border-dungeon-rune/25 bg-panel/90 px-3 shadow-lg backdrop-blur-md"
				>
					<div className="flex items-center gap-2 leading-none">
						<span className="rune-text text-[10px] leading-none text-dungeon-gold">
							HP
						</span>
						<span className="rune-value text-sm leading-none">
							{viewModel.playerHp} / {viewModel.playerMaxHp}
						</span>
					</div>
				</div>

				<GamePageHomeAction />
			</div>
		</div>
	);
}
