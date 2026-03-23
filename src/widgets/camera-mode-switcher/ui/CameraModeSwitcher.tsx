import type { CameraMachineEvent, CameraMode } from "@/features/camera-system";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui";

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
		<Card className="border-border bg-background/70">
			<CardHeader className="space-y-2">
				<CardTitle id="camera-mode-switcher-heading" className="text-sm">
					{CAMERA_MODE_SWITCHER_COPY.TITLE}
				</CardTitle>
				<CardDescription>
					{CAMERA_MODE_SWITCHER_COPY.DESCRIPTION}
				</CardDescription>
			</CardHeader>

			<CardContent>
				<ul className="grid gap-2 sm:grid-cols-2">
					{cameraModeButtons.map((cameraModeButton) => (
						<li key={cameraModeButton.mode}>
							<Button
								variant={cameraModeButton.isActive ? "default" : "outline"}
								aria-pressed={cameraModeButton.isActive}
								onClick={cameraModeButton.handleCameraModeSwitch}
								className="flex w-full items-center justify-between"
							>
								<span>{cameraModeButton.label}</span>
								<Badge variant="secondary">
									{CAMERA_MODE_SWITCHER_COPY.HOTKEY_PREFIX}{" "}
									{cameraModeButton.hotkey}
								</Badge>
							</Button>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
