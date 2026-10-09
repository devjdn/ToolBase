import { writable } from 'svelte/store';
import type { Tool } from '#lib/types.js';

export const selectedTool = writable<Tool | null>(null);
