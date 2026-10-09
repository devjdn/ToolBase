import { dev } from '$app/env';
import { injectAnalytics } from '@vercel/analytics/sveltekit-next';

injectAnalytics({ mode: dev ? 'development' : 'production' });
