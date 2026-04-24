// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UserProfile } from "@/entities/user";

const TEST_USER_PROFILE: UserProfile = {
	id: "user-1",
	uuid: "uuid-1",
	username: "runestone_hero",
	discriminator: "0001",
	createdAt: 1,
	updatedAt: 1,
};

const {
	mockCreateUserMutation,
	mockSubmitAuthUsername,
	mockGetAuthClientStorage,
} = vi.hoisted(() => ({
	mockCreateUserMutation: vi.fn(),
	mockSubmitAuthUsername: vi.fn(),
	mockGetAuthClientStorage: vi.fn(),
}));

const createMemoryStorage = (): Storage =>
	({
		getItem: vi.fn(),
		setItem: vi.fn(),
		removeItem: vi.fn(),
	}) as unknown as Storage;

vi.mock("../api", () => ({
	useCreateUser: () => ({
		mutateAsync: mockCreateUserMutation,
	}),
}));

vi.mock("../lib", async () => {
	const actual = await vi.importActual<typeof import("../lib")>("../lib");

	return {
		...actual,
		getAuthClientStorage: mockGetAuthClientStorage,
		submitAuthUsername: mockSubmitAuthUsername,
	};
});

import { useAuthUsernameSubmission } from "./useAuthUsernameSubmission";

describe("useAuthUsernameSubmission", () => {
	beforeEach(() => {
		const memoryStorage = createMemoryStorage();

		mockCreateUserMutation.mockReset();
		mockSubmitAuthUsername.mockReset();
		mockGetAuthClientStorage.mockReturnValue(memoryStorage);
		mockCreateUserMutation.mockResolvedValue(TEST_USER_PROFILE);
	});

	it("submits usernames through the shared orchestration helper", async () => {
		const sendAuthEvent = vi.fn();
		const { result } = renderHook(() =>
			useAuthUsernameSubmission({
				sendAuthEvent,
				sessionUuid: "existing-session-uuid",
			}),
		);

		await result.current.handleUsernameFormSubmit({
			username: "  runestone_hero  ",
		});

		expect(mockSubmitAuthUsername).toHaveBeenCalledWith({
			username: "  runestone_hero  ",
			sessionUuid: "existing-session-uuid",
			createUser: mockCreateUserMutation,
			storage: expect.any(Object),
			sendAuthEvent,
		});
	});
});
