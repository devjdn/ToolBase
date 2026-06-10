import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { categories } from './schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

await db.insert(categories).values([
	{ name: 'Frameworks', slug: 'frameworks', order: 1 },
	{ name: 'Libraries', slug: 'libraries', order: 2 },
	{ name: 'Databases', slug: 'databases', order: 3 },
	{ name: 'UI Components', slug: 'ui-components', order: 4 },
	{ name: 'Design Tools', slug: 'design-tools', order: 5 },
	{ name: 'Typography', slug: 'typography', order: 6 },
	{ name: 'Icons & Assets', slug: 'icons-assets', order: 7 },
	{ name: 'Inspiration', slug: 'inspiration', order: 8 },
	{ name: 'DevOps & Hosting', slug: 'devops-hosting', order: 9 },
	{ name: 'Tooling', slug: 'tooling', order: 10 },
	{ name: 'AI Tools', slug: 'ai-tools', order: 11 },
	{ name: 'Resources', slug: 'resources', order: 12 }
]);

console.log('Seeded categories');
await client.end();
process.exit(0);
