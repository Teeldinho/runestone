export function GameRoutePendingShell() {
	return (
		<main
			id="main-content"
			aria-busy="true"
			className="flex h-dvh w-dvw flex-col overflow-hidden bg-background text-foreground"
		>
			<header className="flex min-h-[3.75rem] shrink-0 items-center justify-between border-panel-border/70 border-b bg-panel/95 px-4">
				<div className="space-y-1">
					<p className="rune-text text-panel-title">Runestone</p>
					<p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
						Dungeon Observatory
					</p>
				</div>
				<span className="font-mono text-[10px] text-dungeon-rune uppercase tracking-widest">
					Preparing run
				</span>
			</header>

			<div className="grid min-h-0 flex-1 bg-panel-border/70 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(20rem,1.6fr)_minmax(16rem,0.75fr)] lg:gap-px">
				<aside aria-hidden="true" className="hidden bg-panel/95 p-4 lg:block">
					<div className="h-full animate-pulse rounded-xl bg-muted/40 motion-reduce:animate-none" />
				</aside>

				<section
					aria-label="Dungeon viewport loading"
					className="relative flex min-h-0 items-center justify-center overflow-hidden bg-dungeon-fog"
				>
					<div
						role="status"
						aria-label="Loading Dungeon Observatory"
						className="flex w-64 flex-col items-center gap-4 text-center"
					>
						<div className="h-28 w-full animate-pulse rounded-xl border border-panel-border/70 bg-panel/80 motion-reduce:animate-none" />
						<div className="h-3 w-40 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
						<p className="font-mono text-xs text-panel-body uppercase tracking-widest">
							Loading Dungeon Observatory
						</p>
					</div>
				</section>

				<aside aria-hidden="true" className="hidden bg-panel/95 p-4 lg:block">
					<div className="h-full animate-pulse rounded-xl bg-muted/40 motion-reduce:animate-none" />
				</aside>
			</div>
		</main>
	);
}
