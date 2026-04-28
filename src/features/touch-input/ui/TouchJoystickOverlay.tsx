import type { Vector3Tuple } from "@/shared/lib";
import { cn } from "@/shared/lib";

import { useTouchJoystickInput } from "../model";

type TouchJoystickOverlayProps = {
	onMoveVelocity: (velocity: Vector3Tuple) => void;
	onStopVelocity: () => void;
};

export function TouchJoystickOverlay({
	onMoveVelocity,
	onStopVelocity,
}: TouchJoystickOverlayProps) {
	const joystickInput = useTouchJoystickInput({
		onMove: onMoveVelocity,
		onStop: onStopVelocity,
	});

	return (
		<div
			ref={joystickInput.joystickRef}
			className="relative h-[132px] w-[132px] touch-none select-none rounded-full border border-panel-border/90 bg-panel/70 shadow-lg backdrop-blur-md"
			onPointerDown={joystickInput.handlePointerDown}
			onPointerMove={joystickInput.handlePointerMove}
			onPointerUp={joystickInput.handlePointerUp}
			onPointerCancel={joystickInput.handlePointerCancel}
		>
			<div className="absolute inset-3 rounded-full border border-panel-border/70" />
			<div
				className={cn(
					"absolute left-1/2 top-1/2 h-[56px] w-[56px] rounded-full border border-dungeon-rune/70 bg-dungeon-rune/35 shadow-md transition-colors",
					joystickInput.isActive && "bg-dungeon-rune/50",
				)}
				style={{
					transform: `translate(calc(-50% + ${joystickInput.knobOffsetX}px), calc(-50% + ${joystickInput.knobOffsetY}px))`,
				}}
			/>
		</div>
	);
}

export type { TouchJoystickOverlayProps };
