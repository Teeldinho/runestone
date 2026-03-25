import { useSelector } from "@xstate/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { createActor } from "xstate";
import { createCameraStateSnapshot } from "../lib/cameraStateSnapshot";
import { createCameraMachine } from "./cameraMachine";
import type { CameraMachineEvent, CameraStateSnapshot } from "./types";

const cameraMachine = createCameraMachine();

export const useCameraMachine = () => {
	const actorRef = useRef(createActor(cameraMachine).start());
	const actor = actorRef.current;

	const mode = useSelector(actor, (snapshot) => snapshot.value as string);

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

	// Listen for hotkey events from the custom event type
	useEffect(() => {
		const handleHotkey = (e: CustomEvent) => {
			if (e.detail?.hotkey) {
				actor.send({ type: "HOTKEY", hotkey: e.detail.hotkey });
			}
		};

		window.addEventListener("camera-hotkey", handleHotkey as EventListener);
		return () => {
			window.removeEventListener(
				"camera-hotkey",
				handleHotkey as EventListener,
			);
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
