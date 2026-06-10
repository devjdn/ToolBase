import {
	Box,
	Database,
	ComponentIcon,
	Paintbrush,
	Type,
	Shapes,
	Lightbulb,
	Server,
	Wrench,
	Bot,
	GraduationCap,
	Package
} from '@lucide/svelte';
import type { Component } from 'svelte';

export const categoryIcons: Record<string, Component> = {
	frameworks: Box,
	libraries: Package,
	databases: Database,
	'ui-components': ComponentIcon,
	'design-tools': Paintbrush,
	typography: Type,
	'icons-assets': Shapes,
	inspiration: Lightbulb,
	'devops-hosting': Server,
	tooling: Wrench,
	'ai-tools': Bot,
	resources: GraduationCap
};

export const defaultIcon = Box;
