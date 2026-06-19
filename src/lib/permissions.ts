import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

export const statement = {
	...defaultStatements,
	tool: ['create', 'update', 'delete']
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
	tool: ['create']
});

export const editor = ac.newRole({
	tool: ['create', 'update', 'delete']
});

export const admin = ac.newRole({
	tool: ['create', 'update', 'delete'],
	...adminAc.statements
});
