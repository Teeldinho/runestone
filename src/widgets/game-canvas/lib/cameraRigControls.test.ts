import * as THREE from "three";
import { describe, expect, it } from "vitest";

import { setOrbitRotationEnabled } from "./cameraRigControls";

type MockOrbitControls = {
	enableRotate: boolean;
	target: THREE.Vector3;
	update: () => void;
};

const createOrbitRef = (enableRotate: boolean) => {
	return {
		current: {
			enableRotate,
			target: new THREE.Vector3(),
			update: () => {},
		} as MockOrbitControls,
	};
};

describe("setOrbitRotationEnabled", () => {
	it("toggles rotation on every mounted orbit control", () => {
		const firstOrbitRef = createOrbitRef(true);
		const secondOrbitRef = createOrbitRef(true);
		const missingOrbitRef = { current: null };

		setOrbitRotationEnabled(
			[firstOrbitRef, secondOrbitRef, missingOrbitRef],
			false,
		);

		expect(firstOrbitRef.current?.enableRotate).toBe(false);
		expect(secondOrbitRef.current?.enableRotate).toBe(false);
	});

	it("can restore rotation on every mounted orbit control", () => {
		const firstOrbitRef = createOrbitRef(false);
		const secondOrbitRef = createOrbitRef(false);

		setOrbitRotationEnabled([firstOrbitRef, secondOrbitRef], true);

		expect(firstOrbitRef.current?.enableRotate).toBe(true);
		expect(secondOrbitRef.current?.enableRotate).toBe(true);
	});
});
