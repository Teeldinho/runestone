// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UserProfile } from "@/entities/user";
import { AUTH_ROUTE_PATHS } from "../config";

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
	mockNavigate,
	mockPreloadRoute,
	mockSubmitAuthUsername,
	mockGetAuthClientStorage,
} = vi.hoisted(() => ({
	mockCreateUserMutation: vi.fn(),
	mockNavigate: vi.fn(),
	mockPreloadRoute: vi.fn(),
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

vi.mock("@tanstack/react-router", () => ({
	useRouter: () => ({
		navigate: mockNavigate,
		preloadRoute: mockPreloadRoute,
	}),
}));

import { useAuthUsernameSubmission } from "./useAuthUsernameSubmission";

describe("useAuthUsernameSubmission", () => {
	beforeEach(() => {
		const memoryStorage = createMemoryStorage();

		mockCreateUserMutation.mockReset();
		mockNavigate.mockReset();
		mockPreloadRoute.mockReset();
		mockSubmitAuthUsername.mockReset();
		mockGetAuthClientStorage.mockReturnValue(memoryStorage);
		mockCreateUserMutation.mockResolvedValue(TEST_USER_PROFILE);
		mockSubmitAuthUsername.mockResolvedValue(TEST_USER_PROFILE);
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
		expect(mockPreloadRoute).toHaveBeenCalledWith({
			to: AUTH_ROUTE_PATHS.GAME,
		});
		expect(mockNavigate).toHaveBeenCalledWith({
			to: AUTH_ROUTE_PATHS.GAME,
		});
	});

	it("does not navigate when username submission fails to create a profile", async () => {
		const sendAuthEvent = vi.fn();
		mockSubmitAuthUsername.mockResolvedValueOnce(null);

		const { result } = renderHook(() =>
			useAuthUsernameSubmission({
				sendAuthEvent,
				sessionUuid: "existing-session-uuid",
			}),
		);

		await result.current.handleUsernameFormSubmit({
			username: "runestone_hero",
		});

		expect(mockPreloadRoute).not.toHaveBeenCalled();
		expect(mockNavigate).not.toHaveBeenCalled();
	});
});
