import { Check, LockKeyhole } from "lucide-react";

import { cn } from "@/shared/lib";

import { HOME_RUNTIME_ROOMS } from "../config";

export function HomeRuntimeDiagram() {
	return (
		<figure className="observatory-panel relative overflow-hidden rounded-3xl border border-panel-border bg-panel/90 p-4 text-foreground shadow-2xl backdrop-blur-xl sm:p-6">
			<div className="relative z-10 mb-6 flex items-center justify-between gap-4 border-panel-border border-b pb-4 font-mono text-xs">
				<figcaption>floorOne.machine</figcaption>
				<span className="inline-flex items-center gap-2 text-dungeon-rune">
					<span className="size-2 animate-pulse rounded-full bg-dungeon-rune motion-reduce:animate-none" />
					Running
				</span>
			</div>

			<ol className="relative z-10 grid gap-3 before:absolute before:top-5 before:bottom-5 before:left-5 before:w-px before:bg-panel-border sm:gap-4">
				{HOME_RUNTIME_ROOMS.map((room, index) => (
					<li
						key={room.id}
						className={cn(
							"relative grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-panel-border bg-background/55 p-3 font-mono text-xs shadow-lg sm:p-4",
							room.status === "active" &&
								"observatory-active-room border-dungeon-rune bg-dungeon-rune/8",
							room.status === "guarded" && "border-dungeon-rune-sealed/70",
						)}
					>
						<span
							className={cn(
								"relative z-10 flex size-10 items-center justify-center rounded-xl border border-panel-border bg-card text-muted-foreground",
								room.status === "active" &&
									"border-dungeon-rune bg-dungeon-rune/15 text-dungeon-rune",
								room.status === "guarded" &&
									"border-dungeon-rune-sealed text-dungeon-rune-sealed",
							)}
						>
							{String(index + 1).padStart(2, "0")}
						</span>
						<span className="min-w-0">
							<strong className="block truncate font-sans text-sm font-semibold">
								{room.room}
							</strong>
							<span className="text-muted-foreground">
								state: {room.machineState}
							</span>
						</span>
						{room.status === "guarded" ? (
							<LockKeyhole
								aria-label="Guarded"
								className="size-4 text-dungeon-rune-sealed"
							/>
						) : room.status === "active" ? (
							<Check aria-label="Active" className="size-4 text-dungeon-rune" />
						) : (
							<span className="size-2 rounded-full border border-muted-foreground/60" />
						)}
					</li>
				))}
			</ol>

			<div className="relative z-10 mt-5 grid grid-cols-2 gap-3 border-panel-border border-t pt-4 font-mono text-xs">
				<p>
					<span className="block text-muted-foreground">context.key</span>
					false
				</p>
				<p>
					<span className="block text-muted-foreground">guard.treasury</span>
					<span className="text-dungeon-rune-sealed">blocked</span>
				</p>
			</div>
		</figure>
	);
}
