export type UserProfile = {
	id: string;
	uuid: string;
	username: string;
	discriminator: string;
	createdAt: number;
	updatedAt: number;
};

export type UserSession = {
	uuid: string;
	username: string;
	discriminator: string;
};
