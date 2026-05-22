import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui";

export function GamePagePortraitGate() {
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
						Rotate Device
					</CardTitle>
					<CardDescription className="text-sm">
						Landscape mode is required on mobile and tablet.
					</CardDescription>
				</CardHeader>

				<CardContent className="pb-5 text-center text-xs text-muted-foreground">
					Rotate your device to landscape to continue playing.
				</CardContent>
			</Card>
		</section>
	);
}
