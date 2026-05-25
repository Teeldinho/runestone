import { Link } from "@tanstack/react-router";
import { Home, RotateCcw } from "lucide-react";

import { GAME_PAGE_CONTROLS } from "@/pages/game/config";
import { useGamePageMobileTopBarModel } from "@/pages/game/model";
import { Button } from "@/shared/ui";
import { MobileCameraModeSwitcher } from "@/widgets/camera-mode-switcher";
import { MARKETING_ROUTES } from "@/widgets/marketing-shell";

export function GamePageMobileTopBar() {
	const viewModel = useGamePageMobileTopBarModel();

	return (
		<div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-between p-3">
			<div className="pointer-events-auto flex flex-col gap-1.5">
				<Button
					asChild
					variant="dungeon-outline"
					size="icon-sm"
					className="w-fit"
					aria-label={GAME_PAGE_CONTROLS.NAVIGATION.HOME_ARIA_LABEL}
				>
					<Link to={MARKETING_ROUTES.HOME}>
						<Home className="h-4 w-4" />
					</Link>
				</Button>

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
					<span className="text-xs tracking-wide uppercase">Reset Run</span>
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
	);
}
