import { Badge } from "@/shared/ui";
import { HUD_COPY } from "@/widgets/hud/config";

type GameHudDiscoveredRoomsSectionProps = {
	discoveredRoomLabels: string[];
};

export function GameHudDiscoveredRoomsSection({
	discoveredRoomLabels,
}: GameHudDiscoveredRoomsSectionProps) {
	return (
		<section className="space-y-2">
			<h3 className="rune-text border-panel-border border-b pb-1">
				{HUD_COPY.DISCOVERED_ROOMS.TITLE}
			</h3>
			<ul className="flex flex-wrap gap-1">
				{discoveredRoomLabels.map((roomLabel) => (
					<li key={roomLabel}>
						<Badge
							variant="outline"
							className="h-auto rounded border-panel-border bg-black/40 px-2 py-1 text-xs text-muted-foreground shadow-inner"
						>
							{roomLabel}
						</Badge>
					</li>
				))}
			</ul>
		</section>
	);
}

export type { GameHudDiscoveredRoomsSectionProps };
