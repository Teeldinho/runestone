import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui";

export function GamePagePortraitGate() {
	return (
		<main id="main-content" className="h-dvh w-dvw overflow-hidden">
			<section className="flex h-full w-full items-center justify-center p-4">
				<Card className="w-full max-w-sm bg-panel/95 py-0 ring-panel-border/60">
					<CardHeader className="pt-5 text-center">
						<CardTitle className="rune-text text-base text-panel-title">
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
		</main>
	);
}
