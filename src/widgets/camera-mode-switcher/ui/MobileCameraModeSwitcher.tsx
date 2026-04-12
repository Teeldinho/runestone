import type { CameraMachineEvent, CameraMode } from "@/features/camera-system";
import { Button } from "@/shared/ui/button";

import { CAMERA_MODE_ICON_LABELS } from "../config/cameraModeSwitcherConfig";
import { useCameraModeSwitcher } from "../model";

type MobileCameraModeSwitcherProps = {
	activeCameraMode: CameraMode;
	handleCameraModeSwitch: (event: CameraMachineEvent) => void;
};

export function MobileCameraModeSwitcher({
	activeCameraMode,
	handleCameraModeSwitch,
}: MobileCameraModeSwitcherProps) {
	const { cameraModeButtons } = useCameraModeSwitcher({
		activeCameraMode,
		handleCameraModeSwitch,
	});

	return (
		<div className="flex items-center gap-1">
			{cameraModeButtons.map((button) => (
				<Button
					key={button.mode}
					variant={button.isActive ? "dungeon-gold" : "dungeon-outline"}
					size="sm"
					aria-pressed={button.isActive}
					onClick={button.handleCameraModeSwitch}
					className="h-7 min-w-[2.25rem] px-1.5 py-0.5 text-[10px]"
				>
					{CAMERA_MODE_ICON_LABELS[button.mode]}
				</Button>
			))}
		</div>
	);
}
