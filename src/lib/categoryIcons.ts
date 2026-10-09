import Box from '@lucide/svelte/icons/box';
import Database from '@lucide/svelte/icons/database';
import ComponentIcon from '@lucide/svelte/icons/component';
import Paintbrush from '@lucide/svelte/icons/paintbrush';
import Type from '@lucide/svelte/icons/type';
import Shapes from '@lucide/svelte/icons/shapes';
import Lightbulb from '@lucide/svelte/icons/lightbulb';
import Server from '@lucide/svelte/icons/server';
import Wrench from '@lucide/svelte/icons/wrench';
import Bot from '@lucide/svelte/icons/bot';
import GraduationCap from '@lucide/svelte/icons/graduation-cap';
import Package from '@lucide/svelte/icons/package';

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
