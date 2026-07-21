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

export type ReportedTool = {
	reportId: string;
	reason: string;
	reportedAt: Date;
	toolId: string | null;
	toolName: string | null;
	toolUrl: string | null;
	categorySlug: string | null;
	toolLogoUrl: string | null;
	reporterEmail: string | null;
	reporterName: string | null;
};
