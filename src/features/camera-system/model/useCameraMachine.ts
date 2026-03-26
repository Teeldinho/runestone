import { useSelector } from "@xstate/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createActor } from "xstate";
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
	const [actor] = useState(() => createActor(cameraMachine));

	useEffect(() => {
		actor.start();

		return () => {
			actor.stop();
		};
	}, [actor]);

	const mode = useSelector(
		actor,
		(snapshot) => snapshot.value as CameraStateSnapshot["mode"],
	);

	const cameraStateSnapshot = useMemo<CameraStateSnapshot>(() => {
		return createCameraStateSnapshot(mode as CameraStateSnapshot["mode"]);
	}, [mode]);

	const switchToThirdPerson = useCallback(() => {
		actor.send({ type: "SWITCH_TO_THIRD_PERSON" });
	}, [actor]);

	const switchToTopDown = useCallback(() => {
		actor.send({ type: "SWITCH_TO_TOP_DOWN" });
	}, [actor]);

	const switchToFirstPerson = useCallback(() => {
		actor.send({ type: "SWITCH_TO_FIRST_PERSON" });
	}, [actor]);

	const switchToFreeOrbital = useCallback(() => {
		actor.send({ type: "SWITCH_TO_FREE_ORBITAL" });
	}, [actor]);

	const handleCameraModeSwitch = useCallback(
		(event: CameraMachineEvent) => {
			actor.send(event as CameraMachineEvent);
		},
		[actor],
	);

	// Listen for camera mode keyboard hotkeys.
	useEffect(() => {
		const handleHotkey = (event: KeyboardEvent) => {
			if (!isCameraHotkey(event.key)) {
				return;
			}

			actor.send({
				type: CAMERA_EVENTS.HOTKEY,
				hotkey: event.key as CameraHotkey,
			});
		};

		window.addEventListener(CAMERA_HOTKEY_EVENT_TYPE, handleHotkey);
		return () => {
			window.removeEventListener(CAMERA_HOTKEY_EVENT_TYPE, handleHotkey);
		};
	}, [actor]);

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
