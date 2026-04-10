import type { Position } from "@xyflow/react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/ui";
import { INSPECTOR_COPY, INSPECTOR_GUARD_MARKER_INTERACTION } from "../config";
import type { InspectorFlowEdgeGuardMarker } from "../lib";
import { useGuardMarkerEdgeLayout } from "../model";

type GuardMarkerProps = {
	guardMarker: InspectorFlowEdgeGuardMarker;
	collisionSeed: string;
	markerIndex: number;
	markerCount: number;
	markerLaneOffset: number;
	labelX: number;
	labelY: number;
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
	isSelfLoopTransition: boolean;
	sourcePosition?: Position;
	targetPosition?: Position;
};

export function GuardMarker({
	guardMarker,
	collisionSeed,
	markerIndex,
	markerCount,
	markerLaneOffset,
	labelX,
	labelY,
	sourceX,
	sourceY,
	targetX,
	targetY,
	isSelfLoopTransition,
	sourcePosition,
	targetPosition,
}: GuardMarkerProps) {
	const markerLayout = useGuardMarkerEdgeLayout({
		sourceX,
		sourceY,
		targetX,
		targetY,
		isSelfLoopTransition,
		collisionSeed,
		collisionOrder: guardMarker.collisionOrder,
		collisionGroupSize: guardMarker.collisionGroupSize,
		sourcePosition,
		targetPosition,
		markerLaneOffset,
		markerIndex,
		markerCount,
		labelX,
		labelY,
		directionIndicatorMode: guardMarker.directionIndicatorMode,
		markerColor: guardMarker.color,
	});

	return (
		<HoverCard
			openDelay={INSPECTOR_GUARD_MARKER_INTERACTION.HOVER_OPEN_DELAY_MS}
			closeDelay={INSPECTOR_GUARD_MARKER_INTERACTION.HOVER_CLOSE_DELAY_MS}
		>
			<HoverCardTrigger asChild>
				<button
					type="button"
					className="nodrag nopan pointer-events-auto absolute flex items-center justify-center rounded-full"
					style={markerLayout.markerButtonStyles}
					aria-label={guardMarker.guardLabel}
				>
					<span
						className={markerLayout.bubbleClassName}
						style={markerLayout.markerBubbleStyles}
					/>
					{markerLayout.hasDirectionIndicators
						? markerLayout.markerArrows.map((markerArrow) => (
								<span
									key={markerArrow.id}
									className={markerLayout.arrowClassName}
									style={markerArrow.styles}
								>
									{markerArrow.symbol}
								</span>
							))
						: null}
				</button>
			</HoverCardTrigger>
			<HoverCardContent className="w-72">
				<p className="text-panel-title text-[11px] font-semibold">
					{INSPECTOR_COPY.GUARD_TOOLTIP_TITLE}
				</p>
				<p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
					{guardMarker.guardLabel}
				</p>
			</HoverCardContent>
		</HoverCard>
	);
}
