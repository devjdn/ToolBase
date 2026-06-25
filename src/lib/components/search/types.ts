import type { Tool } from '$lib/types';

export type SearchApiResponse = {
	toolResults: Array<Tool>;

	categoryResults: {
		id: string;
		name: string;
		slug: string;
	}[];
};

export type SearchResultType = 'tool' | 'category' | 'page';

type BaseSearchResult<T extends SearchResultType> = {
	type: T;
	label: string;
	action: () => void;
};

export type SearchResultTool = BaseSearchResult<'tool'> & {
	tool: Tool;
};

export type SearchResultPage = BaseSearchResult<'page'> & {
	path: string;
};

export type SearchResultCategory = BaseSearchResult<'category'> & {
	categorySlug: string;
	path: string;
};

export type SearchResult = SearchResultTool | SearchResultPage | SearchResultCategory;
