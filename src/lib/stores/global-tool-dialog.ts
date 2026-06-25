import { writable } from 'svelte/store';
import type { Tool } from '$lib/types';

export const selectedTool = writable<Tool | null>(null);
