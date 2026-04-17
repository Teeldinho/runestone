import type { Vector3Tuple } from "@/shared/lib";

import { TOUCH_JOYSTICK_CONFIG } from "../config";
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
			className={`relative rounded-full border border-panel-border/90 bg-panel/70 shadow-lg backdrop-blur-md touch-none select-none ${TOUCH_JOYSTICK_CONFIG.CONTAINER_SIZE_CLASS_NAME}`}
			onPointerDown={joystickInput.handlePointerDown}
			onPointerMove={joystickInput.handlePointerMove}
			onPointerUp={joystickInput.handlePointerUp}
			onPointerCancel={joystickInput.handlePointerCancel}
		>
			<div className="absolute inset-3 rounded-full border border-panel-border/70" />
			<div
				className={`absolute left-1/2 top-1/2 rounded-full border border-dungeon-rune/70 bg-dungeon-rune/35 shadow-md transition-colors ${TOUCH_JOYSTICK_CONFIG.KNOB_SIZE_CLASS_NAME} ${joystickInput.isActive ? "bg-dungeon-rune/50" : ""}`}
				style={{
					transform: `translate(calc(-50% + ${joystickInput.knobOffsetX}px), calc(-50% + ${joystickInput.knobOffsetY}px))`,
				}}
			/>
		</div>
	);
}

export type { TouchJoystickOverlayProps };
