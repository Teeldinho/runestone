import { GAME_PAGE_PORTRAIT_GATE } from "@/pages/game/config";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui";

type GamePagePortraitGateProps = {
	isVisible: boolean;
};

export function GamePagePortraitGate({ isVisible }: GamePagePortraitGateProps) {
	if (!isVisible) {
		return null;
	}

	return (
		<section
			aria-labelledby="game-portrait-gate-heading"
			className="fixed inset-0 z-[60] flex items-center justify-center bg-panel/90 p-4 backdrop-blur-sm"
		>
			<Card className="w-full max-w-sm bg-panel/95 py-0 ring-panel-border/60">
				<CardHeader className="pt-5 text-center">
					<CardTitle
						id="game-portrait-gate-heading"
						className="rune-text text-base text-panel-title"
					>
						{GAME_PAGE_PORTRAIT_GATE.TITLE}
					</CardTitle>
					<CardDescription className="text-sm">
						{GAME_PAGE_PORTRAIT_GATE.DESCRIPTION}
					</CardDescription>
				</CardHeader>

				<CardContent className="pb-5 text-center text-xs text-muted-foreground">
					{GAME_PAGE_PORTRAIT_GATE.BODY}
				</CardContent>
			</Card>
		</section>
	);
}
