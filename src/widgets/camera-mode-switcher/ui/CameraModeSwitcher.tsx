import type { CameraMachineEvent, CameraMode } from "@/features/camera-system";
import { cn } from "@/shared/lib";
import { CAMERA_MODE_SWITCHER_COPY } from "../config";
import { useCameraModeSwitcher } from "../model";

type CameraModeSwitcherProps = {
	activeCameraMode: CameraMode;
	handleCameraModeSwitch: (event: CameraMachineEvent) => void;
};

export function CameraModeSwitcher({
	activeCameraMode,
	handleCameraModeSwitch,
}: CameraModeSwitcherProps) {
	const { cameraModeButtons } = useCameraModeSwitcher({
		activeCameraMode,
		handleCameraModeSwitch,
	});

	return (
		<div className="flex w-full items-center justify-center gap-2 px-4 py-1">
			<span className="rune-text mr-4 hidden sm:inline-block">
				{CAMERA_MODE_SWITCHER_COPY.DESKTOP_LABEL}
			</span>
			<ul className="flex flex-1 items-center gap-2 sm:flex-initial">
				{cameraModeButtons.map((cameraModeButton) => (
					<li key={cameraModeButton.mode} className="flex-1 sm:flex-initial">
						<button
							type="button"
							aria-pressed={cameraModeButton.isActive}
							onClick={cameraModeButton.handleCameraModeSwitch}
							className={cn(
								"dungeon-btn",
								cameraModeButton.isActive && "dungeon-btn-active",
							)}
						>
							<span>{cameraModeButton.label}</span>
							<span className="ml-2 rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-(--dungeon-rune)">
								{cameraModeButton.hotkey}
							</span>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
