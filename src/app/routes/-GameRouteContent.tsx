import { AudioProvider } from "@/app/providers/AudioProvider";
import { GameMachineProvider } from "@/app/providers/GameMachineProvider";
import { GamePage } from "@/pages/game";

export function GameRouteContent() {
	return (
		<GameMachineProvider>
			<AudioProvider>
				<GamePage />
			</AudioProvider>
		</GameMachineProvider>
	);
}
