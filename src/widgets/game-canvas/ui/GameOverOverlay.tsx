import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui";

import { GAME_OVER_COPY } from "../config";

type GameOverOverlayProps = {
	isGameOver: boolean;
	onRestart: () => void;
};

export function GameOverOverlay({
	isGameOver,
	onRestart,
}: GameOverOverlayProps) {
	return (
		<Dialog open={isGameOver}>
			<DialogContent
				showCloseButton={false}
				onEscapeKeyDown={(e) => e.preventDefault()}
				onInteractOutside={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle className="text-4xl font-bold tracking-widest text-red-400 uppercase">
						{GAME_OVER_COPY.TITLE}
					</DialogTitle>
					<DialogDescription>{GAME_OVER_COPY.DESCRIPTION}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onRestart}>
						{GAME_OVER_COPY.RESTART_LABEL}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
