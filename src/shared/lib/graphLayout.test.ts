import { describe, expect, it } from "vitest";

import { getGraphLayout } from "./graphLayout";

describe("getGraphLayout", () => {
	it("returns positioned nodes and preserved edges", () => {
		const layout = getGraphLayout({
			nodes: [
				{ id: "entrance", width: 180, height: 72 },
				{ id: "library", width: 180, height: 72 },
			],
			edges: [{ source: "entrance", target: "library" }],
		});

		expect(layout.nodes).toHaveLength(2);
		expect(layout.edges).toEqual([{ source: "entrance", target: "library" }]);
		expect(layout.nodes[0]?.position.x).toEqual(expect.any(Number));
		expect(layout.nodes[0]?.position.y).toEqual(expect.any(Number));
	});

	it("supports left-to-right layout direction", () => {
		const layout = getGraphLayout({
			nodes: [
				{ id: "a", width: 120, height: 64 },
				{ id: "b", width: 120, height: 64 },
			],
			edges: [{ source: "a", target: "b" }],
			direction: "LR",
		});

		const first = layout.nodes[0];
		const second = layout.nodes[1];

		expect(first?.position.x).toBeLessThan(
			second?.position.x ?? Number.POSITIVE_INFINITY,
		);
	});
});
