import type { CameraMachineEvent, CameraMode } from "@/features/camera-system";
import { CAMERA_MODES } from "@/shared/config";

import { useCameraModeSwitcher } from "../model";

type MobileCameraModeSwitcherProps = {
	activeCameraMode: CameraMode;
	handleCameraModeSwitch: (event: CameraMachineEvent) => void;
};

const CAMERA_MODE_ICON_LABELS: Record<CameraMode, string> = {
	[CAMERA_MODES.THIRD_PERSON]: "3P",
	[CAMERA_MODES.TOP_DOWN]: "TD",
	[CAMERA_MODES.FIRST_PERSON]: "1P",
	[CAMERA_MODES.FREE_ORBITAL]: "FO",
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
				<button
					key={button.mode}
					type="button"
					aria-pressed={button.isActive}
					onClick={button.handleCameraModeSwitch}
					className={`flex h-7 min-w-[2.25rem] items-center justify-center rounded border px-1.5 py-0.5 text-[10px] font-semibold transition-all ${
						button.isActive
							? "border-dungeon-gold bg-dungeon-gold/20 text-dungeon-gold"
							: "border-panel-border bg-panel/60 text-muted-foreground hover:border-panel-border/80"
					}`}
				>
					{CAMERA_MODE_ICON_LABELS[button.mode]}
				</button>
			))}
		</div>
	);
}
