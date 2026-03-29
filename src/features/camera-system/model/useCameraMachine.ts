import { useMachine } from "@xstate/react";
import { useCallback, useEffect, useMemo } from "react";
import {
	CAMERA_EVENTS,
	CAMERA_HOTKEY_EVENT_TYPE,
	type CameraHotkey,
} from "../config";
import { isCameraHotkey } from "../lib";
import { createCameraStateSnapshot } from "../lib/cameraStateSnapshot";
import { createCameraMachine } from "./cameraMachine";
import type { CameraMachineEvent, CameraStateSnapshot } from "./types";

const cameraMachine = createCameraMachine();

export const useCameraMachine = () => {
	const [snapshot, send, actor] = useMachine(cameraMachine);
	const mode = snapshot.value as CameraStateSnapshot["mode"];

	const cameraStateSnapshot = useMemo<CameraStateSnapshot>(() => {
		return createCameraStateSnapshot(mode as CameraStateSnapshot["mode"]);
	}, [mode]);

	const switchToThirdPerson = useCallback(() => {
		send({ type: "SWITCH_TO_THIRD_PERSON" });
	}, [send]);

	const switchToTopDown = useCallback(() => {
		send({ type: "SWITCH_TO_TOP_DOWN" });
	}, [send]);

	const switchToFirstPerson = useCallback(() => {
		send({ type: "SWITCH_TO_FIRST_PERSON" });
	}, [send]);

	const switchToFreeOrbital = useCallback(() => {
		send({ type: "SWITCH_TO_FREE_ORBITAL" });
	}, [send]);

	const handleCameraModeSwitch = useCallback(
		(event: CameraMachineEvent) => {
			send(event as CameraMachineEvent);
		},
		[send],
	);

	// Listen for camera mode keyboard hotkeys.
	useEffect(() => {
		const handleHotkey = (event: KeyboardEvent) => {
			if (!isCameraHotkey(event.key)) {
				return;
			}

			send({
				type: CAMERA_EVENTS.HOTKEY,
				hotkey: event.key as CameraHotkey,
			});
		};

		window.addEventListener(CAMERA_HOTKEY_EVENT_TYPE, handleHotkey);
		return () => {
			window.removeEventListener(CAMERA_HOTKEY_EVENT_TYPE, handleHotkey);
		};
	}, [send]);

	return useMemo(
		() => ({
			mode,
			cameraStateSnapshot,
			actor,
			switchToThirdPerson,
			switchToTopDown,
			switchToFirstPerson,
			switchToFreeOrbital,
			handleCameraModeSwitch,
		}),
		[
			mode,
			cameraStateSnapshot,
			actor,
			switchToThirdPerson,
			switchToTopDown,
			switchToFirstPerson,
			switchToFreeOrbital,
			handleCameraModeSwitch,
		],
	);
};
