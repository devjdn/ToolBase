export type Tool = {
	id: string;
	name: string;
	description: string | null;
	url: string;
	logoUrl: string | null;
	createdAt: Date;
	updatedAt: Date;
	category?: {
		id: string;
		name: string;
		color: string | null;
		slug: string;
	} | null;
};
