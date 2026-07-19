import type { CameraMachineEvent, CameraMode } from "@/features/camera-system";
import { Button } from "@/shared/ui";
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
		<div className="flex w-full min-w-0 items-center gap-2 px-2 py-1">
			<span className="rune-text hidden shrink-0 2xl:inline-block">
				{CAMERA_MODE_SWITCHER_COPY.DESKTOP_LABEL}
			</span>
			<ul className="grid min-w-0 flex-1 grid-cols-4 gap-2">
				{cameraModeButtons.map((cameraModeButton) => (
					<li key={cameraModeButton.mode} className="min-w-0">
						<Button
							type="button"
							variant="dungeon-toggle"
							aria-pressed={cameraModeButton.isActive}
							onClick={cameraModeButton.handleCameraModeSwitch}
							className="min-h-11 w-full min-w-0"
						>
							<span className="truncate">{cameraModeButton.label}</span>
							<span className="ml-1 hidden rounded bg-background/65 px-1.5 py-0.5 font-mono text-[10px] text-dungeon-rune xl:inline-flex">
								{cameraModeButton.hotkey}
							</span>
						</Button>
					</li>
				))}
			</ul>
		</div>
	);
}
