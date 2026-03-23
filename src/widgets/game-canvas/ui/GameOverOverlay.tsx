import { Button } from "@/shared/ui";

type GameOverOverlayProps = {
	onRestart: () => void;
};

export function GameOverOverlay({ onRestart }: GameOverOverlayProps) {
	return (
		<div
			role="alertdialog"
			aria-labelledby="game-over-heading"
			aria-live="assertive"
			className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg bg-black/80 backdrop-blur-sm"
		>
			<h2
				id="game-over-heading"
				className="text-4xl font-bold tracking-widest text-red-400 uppercase"
			>
				You Died
			</h2>
			<Button variant="outline" onClick={onRestart}>
				Restart
			</Button>
		</div>
	);
}
