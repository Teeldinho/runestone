import {
	INPUT_POINTER_DATA_ATTRIBUTE_VALUES,
	INPUT_POINTER_DATA_ATTRIBUTES,
	POINTER_ROLES,
} from "@/shared/config";
import type { Vector3Tuple } from "@/shared/lib";
import { cn } from "@/shared/lib";

import { TOUCH_JOYSTICK_CONFIG } from "../config";
import { useTouchJoystickInput } from "../model";

type TouchJoystickZoneProps = {
	readonly onMoveVelocity: (velocity: Vector3Tuple) => void;
	readonly onStopVelocity: () => void;
	readonly className?: string;
};

export function TouchJoystickZone({
	onMoveVelocity,
	onStopVelocity,
	className,
}: TouchJoystickZoneProps) {
	const joystickInput = useTouchJoystickInput({
		onMove: onMoveVelocity,
		onStop: onStopVelocity,
	});

	return (
		<div
			ref={joystickInput.joystickRef}
			{...{
				[INPUT_POINTER_DATA_ATTRIBUTES.ROLE]: POINTER_ROLES.MOVEMENT,
				[INPUT_POINTER_DATA_ATTRIBUTES.BLOCKS_LOOK]:
					INPUT_POINTER_DATA_ATTRIBUTE_VALUES.TRUE,
			}}
			className={cn(
				"relative touch-none select-none rounded-full border border-panel-border/90 bg-panel/70 shadow-lg backdrop-blur-md",
				className,
			)}
			style={{
				height: `${TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX}px`,
				width: `${TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_PX}px`,
			}}
			onPointerDown={joystickInput.handlePointerDown}
			onPointerMove={joystickInput.handlePointerMove}
			onPointerUp={joystickInput.handlePointerUp}
			onPointerCancel={joystickInput.handlePointerCancel}
		>
			<div className="absolute inset-4 rounded-full border border-panel-border/70" />
			<div
				className={cn(
					"absolute left-1/2 top-1/2 rounded-full border border-dungeon-rune/70 bg-dungeon-rune/35 shadow-md transition-colors",
					joystickInput.isActive && "bg-dungeon-rune/50",
				)}
				style={{
					height: `${TOUCH_JOYSTICK_CONFIG.KNOB_SIZE_PX}px`,
					transform: `translate(calc(-50% + ${joystickInput.knobOffsetX}px), calc(-50% + ${joystickInput.knobOffsetY}px))`,
					width: `${TOUCH_JOYSTICK_CONFIG.KNOB_SIZE_PX}px`,
				}}
			/>
		</div>
	);
}

export type { TouchJoystickZoneProps };
