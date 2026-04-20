import { shallowEqual } from "@xstate/react";
import { useEffect, useRef } from "react";

import { createDoorwayNavigationRuntime } from "../lib/doorwayNavigationRuntime";
import {
	selectDoorwayNavigationContext,
	useGameMachineSelector,
	useSendDungeonMachineEvent,
} from "./gameMachineRuntime";

export const useDoorwayNavigation = (): void => {
	const context = useGameMachineSelector(
		selectDoorwayNavigationContext,
		shallowEqual,
	);

	const sendDungeonMachineEvent = useSendDungeonMachineEvent();
	const sendEventRef = useRef(sendDungeonMachineEvent);
	sendEventRef.current = sendDungeonMachineEvent;

	useEffect(() => {
		const runtime = createDoorwayNavigationRuntime(context, (event) => {
			sendEventRef.current(event);
		});
		return runtime.subscribe();
	}, [context]);
};
