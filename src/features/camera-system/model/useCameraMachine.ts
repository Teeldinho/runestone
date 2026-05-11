import { useMachine } from "@xstate/react";
import { useCallback, useEffect, useMemo } from "react";
import {
	CAMERA_EVENT_TYPES,
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
		const baseSnapshot = createCameraStateSnapshot(
			mode as CameraStateSnapshot["mode"],
		);

		return {
			...baseSnapshot,
			yaw: snapshot.context.yaw,
			pitch: snapshot.context.pitch,
			distance: snapshot.context.distance,
		};
	}, [
		mode,
		snapshot.context.yaw,
		snapshot.context.pitch,
		snapshot.context.distance,
	]);

	const switchToThirdPerson = useCallback(() => {
		send({ type: CAMERA_EVENT_TYPES.SWITCH_TO_THIRD_PERSON });
	}, [send]);

	const switchToTopDown = useCallback(() => {
		send({ type: CAMERA_EVENT_TYPES.SWITCH_TO_TOP_DOWN });
	}, [send]);

	const switchToFirstPerson = useCallback(() => {
		send({ type: CAMERA_EVENT_TYPES.SWITCH_TO_FIRST_PERSON });
	}, [send]);

	const switchToFreeOrbital = useCallback(() => {
		send({ type: CAMERA_EVENT_TYPES.SWITCH_TO_FREE_ORBITAL });
	}, [send]);

	const handleCameraModeSwitch = useCallback(
		(event: CameraMachineEvent) => {
			send(event as CameraMachineEvent);
		},
		[send],
	);

	useEffect(() => {
		const handleHotkey = (event: KeyboardEvent) => {
			if (!isCameraHotkey(event.key)) {
				return;
			}

			send({
				type: CAMERA_EVENT_TYPES.HOTKEY,
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
