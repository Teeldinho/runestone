export function HomePage() {
	return (
		<main className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center p-8">
			<section className="w-full rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-8 text-center shadow-xl shadow-cyan-800/20 backdrop-blur">
				<h1 className="text-3xl font-semibold text-cyan-300">Runestone</h1>
				<p className="mt-4 text-base text-slate-200">
					Enter the dungeon and learn live state machines.
				</p>
			</section>
		</main>
	);
}
