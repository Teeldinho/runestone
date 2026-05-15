export type {
	CameraEvent,
	CameraEventObject,
	CameraHotkey,
	CameraMode,
} from "./config";

export {
	CAMERA_DEFAULT_MODE,
	CAMERA_EVENTS,
	CAMERA_HOTKEYS,
	CAMERA_MACHINE_ID,
	CAMERA_MODES,
} from "./config";

export type {
	CameraControlsUpAxisKey,
	CameraModeId,
} from "./config/cameraControlConfig";

export {
	CAMERA_CONTROLS_CONSTANTS,
	CAMERA_CONTROLS_MODE_POLICY,
	CAMERA_CONTROLS_TOP_DOWN_AZIMUTH,
	CAMERA_CONTROLS_UP_AXIS_KEYS,
	CAMERA_MODE_IDS,
	CAMERA_UP_VECTORS,
} from "./config/cameraControlConfig";

export {
	areVector3TuplesApproximatelyEqual,
	clampCameraControlsPolarAngle,
	createCameraStateSnapshot,
	getCameraModeFromEvent,
	isCameraHotkey,
	resolveCameraControlsFollowTarget,
	resolveCameraControlsInputBindings,
	resolveCameraControlsModePolicy,
	resolveCameraControlsModePose,
	resolveCameraControlsTransitionAngles,
	resolveCameraControlsUpAxisKey,
	resolveCameraControlsUpVector,
	resolveCameraControlsWorldFacingAzimuth,
	resolveMovementAzimuthFromCameraControls,
	shouldRenderCameraControls,
} from "./lib";

export { useCameraSystem } from "./model";
export { createCameraMachine } from "./model/cameraMachine";
export type {
	CameraHotkeyBinding,
	CameraMachineEvent,
	CameraStateSnapshot,
} from "./model/types";
export { useCameraMachine } from "./model/useCameraMachine";
export type { CameraRuntimeSnapshot } from "./model/useRunestoneCameraControls";
export { useRunestoneCameraControls } from "./model/useRunestoneCameraControls";

export type { RunestoneCameraControlsProps } from "./ui/RunestoneCameraControls";
export { RunestoneCameraControls } from "./ui/RunestoneCameraControls";
