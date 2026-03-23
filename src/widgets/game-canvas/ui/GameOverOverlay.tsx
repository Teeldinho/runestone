import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui";

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
						You Died
					</DialogTitle>
					<DialogDescription>Your dungeon run has ended.</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onRestart}>
						Restart
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
