import { HUD_COPY } from "@/widgets/hud/config";

type HudDiscoveredRoomsProps = {
	roomLabels: string[];
};

export function HudDiscoveredRooms({ roomLabels }: HudDiscoveredRoomsProps) {
	return (
		<section className="space-y-2">
			<h3 className="rune-text border-b border-panel-border pb-1">
				{HUD_COPY.DISCOVERED_ROOMS.TITLE}
			</h3>
			<ul className="flex flex-wrap gap-1">
				{roomLabels.map((roomLabel) => (
					<li
						key={roomLabel}
						className="rounded border border-panel-border bg-black/40 px-2 py-1 text-xs text-muted-foreground shadow-inner"
					>
						{roomLabel}
					</li>
				))}
			</ul>
		</section>
	);
}
