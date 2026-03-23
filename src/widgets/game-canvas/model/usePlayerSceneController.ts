import { usePlayerMachineRuntime } from "@/entities/player";
import { usePlayerInput } from "@/features/dungeon-navigation";

export const usePlayerSceneController = (): void => {
	const { sendPlayerMachineEvent } = usePlayerMachineRuntime();

	usePlayerInput({ sendPlayerEvent: sendPlayerMachineEvent });
};
